import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5000;
const CSV_PATH = process.env.CSV_PATH || path.join(__dirname, 'data', 'Smoking_Health_Analysis.csv');

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// In-memory dataset cache
let patientsData = [];
let isDataLoaded = false;

// Helpers to compute calculated columns matching DAX rules
function calculateAgeGroup(age) {
  if (age >= 18 && age <= 29) return '18–29';
  if (age >= 30 && age <= 44) return '30–44';
  if (age >= 45 && age <= 59) return '45–59';
  if (age >= 60) return '60+';
  return 'Unknown';
}

function calculateBPRiskCategory(systolic, diastolic) {
  // Standard clinical / DAX categories:
  // Lower Range: Systolic < 120 and Diastolic < 80
  // Elevated: Systolic 120-129 and Diastolic < 80
  // High: Systolic >= 130 or Diastolic >= 80
  if (systolic < 120 && diastolic < 80) return 'Lower Range';
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) return 'Elevated';
  if (systolic >= 130 || diastolic >= 80) return 'High';
  return 'High';
}

function calculateSmokingExposure(status, cigsPerDay, yearsSmoking) {
  const packYears = (cigsPerDay / 20) * yearsSmoking;
  let category = 'Non-Smoker (0 PY)';

  if (status === 'Never Smoked') {
    category = 'Non-Smoker (0 PY)';
  } else if (packYears === 0) {
    category = 'Past Exposure (Former)';
  } else if (packYears < 10) {
    category = 'Low Exposure (<10 PY)';
  } else if (packYears < 25) {
    category = 'Moderate Exposure (10–24 PY)';
  } else {
    category = 'Heavy Exposure (25+ PY)';
  }

  let yearsBracket = '0 Years';
  if (yearsSmoking === 0) yearsBracket = '0 Years';
  else if (yearsSmoking <= 10) yearsBracket = '1–10 Years';
  else if (yearsSmoking <= 25) yearsBracket = '11–25 Years';
  else yearsBracket = '26+ Years';

  return {
    packYears: Number(packYears.toFixed(2)),
    exposureCategory: category,
    yearsBracket
  };
}

// Load CSV into memory with calculated columns
function loadDataset() {
  return new Promise((resolve, reject) => {
    const results = [];
    const fullPath = path.resolve(__dirname, CSV_PATH);

    if (!fs.existsSync(fullPath)) {
      return reject(new Error(`CSV file not found at ${fullPath}`));
    }

    fs.createReadStream(fullPath)
      .pipe(csv())
      .on('data', (row) => {
        const age = parseInt(row.Age, 10);
        const cigsPerDay = parseFloat(row.Cigarettes_Per_Day) || 0;
        const yearsSmoking = parseFloat(row.Years_Smoking) || 0;
        const cholesterol = parseFloat(row.Total_Cholesterol_mg_dL) || 0;
        const systolic = parseFloat(row.Systolic_BP_mmHg) || 0;
        const diastolic = parseFloat(row.Diastolic_BP_mmHg) || 0;
        const bmi = parseFloat(row.BMI) || 0;
        const heartRate = parseInt(row.Resting_Heart_Rate_bpm, 10) || 0;

        const ageGroup = calculateAgeGroup(age);
        const bpRisk = calculateBPRiskCategory(systolic, diastolic);
        const exposure = calculateSmokingExposure(row.Smoking_Status, cigsPerDay, yearsSmoking);

        results.push({
          patientId: row.Patient_ID,
          age,
          gender: row.Gender,
          region: row.Region,
          diagnosisDate: row.Diagnosis_Date,
          smokingStatus: row.Smoking_Status,
          cigarettesPerDay: cigsPerDay,
          yearsSmoking: yearsSmoking,
          diagnosedOrgan: row.Diagnosed_Organ,
          healthCondition: row.Health_Condition,
          totalCholesterol: cholesterol,
          systolicBP: systolic,
          diastolicBP: diastolic,
          bmi,
          restingHeartRate: heartRate,
          // DAX Calculated Columns:
          ageGroup,
          bpRiskCategory: bpRisk,
          packYears: exposure.packYears,
          smokingExposureCategory: exposure.exposureCategory,
          smokingYearsBracket: exposure.yearsBracket,
          hasRecordedOrgan: row.Diagnosed_Organ !== 'No Recorded Organ Condition',
          hasRecordedCondition: row.Health_Condition !== 'No Diagnosed Condition'
        });
      })
      .on('end', () => {
        patientsData = results;
        isDataLoaded = true;
        console.log(`Successfully loaded ${patientsData.length} patient records into memory.`);
        resolve(patientsData);
      })
      .on('error', (err) => {
        console.error('Error reading CSV:', err);
        reject(err);
      });
  });
}

// Filter helper
function filterPatients(data, query) {
  return data.filter((p) => {
    if (query.region && query.region !== 'All') {
      const regions = query.region.split(',');
      if (!regions.includes(p.region)) return false;
    }
    if (query.gender && query.gender !== 'All') {
      const genders = query.gender.split(',');
      if (!genders.includes(p.gender)) return false;
    }
    if (query.ageGroup && query.ageGroup !== 'All') {
      const ageGroups = query.ageGroup.split(',');
      if (!ageGroups.includes(p.ageGroup)) return false;
    }
    if (query.smokingStatus && query.smokingStatus !== 'All') {
      const statuses = query.smokingStatus.split(',');
      if (!statuses.includes(p.smokingStatus)) return false;
    }
    if (query.bpRisk && query.bpRisk !== 'All') {
      const risks = query.bpRisk.split(',');
      if (!risks.includes(p.bpRiskCategory)) return false;
    }
    if (query.organ && query.organ !== 'All') {
      const organs = query.organ.split(',');
      if (!organs.includes(p.diagnosedOrgan)) return false;
    }
    if (query.condition && query.condition !== 'All') {
      const conditions = query.condition.split(',');
      if (!conditions.includes(p.healthCondition)) return false;
    }
    if (query.exposureCategory && query.exposureCategory !== 'All') {
      const exposures = query.exposureCategory.split(',');
      if (!exposures.includes(p.smokingExposureCategory)) return false;
    }
    if (query.startDate) {
      if (new Date(p.diagnosisDate) < new Date(query.startDate)) return false;
    }
    if (query.endDate) {
      if (new Date(p.diagnosisDate) > new Date(query.endDate)) return false;
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      const match =
        p.patientId.toLowerCase().includes(s) ||
        p.healthCondition.toLowerCase().includes(s) ||
        p.diagnosedOrgan.toLowerCase().includes(s) ||
        p.region.toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });
}

// ----------------- ROUTES -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    loadedRecords: patientsData.length,
    timestamp: new Date().toISOString()
  });
});

// Objective 1: KPIs
app.get('/api/analytics/kpis', (req, res) => {
  const filtered = filterPatients(patientsData, req.query);
  const total = filtered.length;

  if (total === 0) {
    return res.json({
      totalPatients: 0,
      currentSmokers: 0,
      currentSmokersPct: 0,
      recordedOrganPatients: 0,
      recordedOrganPct: 0,
      recordedConditionPatients: 0,
      recordedConditionPct: 0,
      formerSmokers: 0,
      neverSmoked: 0,
      avgAge: 0,
      avgCholesterol: 0,
      avgSystolicBP: 0,
      avgDiastolicBP: 0,
      avgBMI: 0,
      avgHeartRate: 0
    });
  }

  let currentSmokers = 0;
  let formerSmokers = 0;
  let neverSmoked = 0;
  let recordedOrgan = 0;
  let recordedCondition = 0;
  let sumAge = 0;
  let sumCholesterol = 0;
  let sumSystolic = 0;
  let sumDiastolic = 0;
  let sumBMI = 0;
  let sumHeartRate = 0;

  for (const p of filtered) {
    if (p.smokingStatus === 'Current Smoker') currentSmokers++;
    else if (p.smokingStatus === 'Former Smoker') formerSmokers++;
    else if (p.smokingStatus === 'Never Smoked') neverSmoked++;

    if (p.hasRecordedOrgan) recordedOrgan++;
    if (p.hasRecordedCondition) recordedCondition++;

    sumAge += p.age;
    sumCholesterol += p.totalCholesterol;
    sumSystolic += p.systolicBP;
    sumDiastolic += p.diastolicBP;
    sumBMI += p.bmi;
    sumHeartRate += p.restingHeartRate;
  }

  res.json({
    totalPatients: total,
    currentSmokers,
    currentSmokersPct: Number(((currentSmokers / total) * 100).toFixed(2)),
    formerSmokers,
    formerSmokersPct: Number(((formerSmokers / total) * 100).toFixed(2)),
    neverSmoked,
    neverSmokedPct: Number(((neverSmoked / total) * 100).toFixed(2)),
    recordedOrganPatients: recordedOrgan,
    recordedOrganPct: Number(((recordedOrgan / total) * 100).toFixed(2)),
    recordedConditionPatients: recordedCondition,
    recordedConditionPct: Number(((recordedCondition / total) * 100).toFixed(2)),
    avgAge: Number((sumAge / total).toFixed(1)),
    avgCholesterol: Number((sumCholesterol / total).toFixed(1)),
    avgSystolicBP: Number((sumSystolic / total).toFixed(1)),
    avgDiastolicBP: Number((sumDiastolic / total).toFixed(1)),
    avgBMI: Number((sumBMI / total).toFixed(1)),
    avgHeartRate: Number((sumHeartRate / total).toFixed(1))
  });
});

// Comprehensive analytical overview covering Objectives 1, 2, 3, 4
app.get('/api/analytics/overview', (req, res) => {
  const filtered = filterPatients(patientsData, req.query);
  const total = filtered.length;

  // 1. Smoking Status Distribution (Objective 3.3) & Cigarettes per Day (Objective 3.1)
  const smokingStats = {
    'Current Smoker': { count: 0, totalCigs: 0, avgCigs: 0, pct: 0 },
    'Former Smoker': { count: 0, totalCigs: 0, avgCigs: 0, pct: 0 },
    'Never Smoked': { count: 0, totalCigs: 0, avgCigs: 0, pct: 0 }
  };

  // 2. Organ-wise Health Condition Distribution (Objective 3.2)
  const organConditionMap = {};

  // 3. Cholesterol Levels by BP Risk Category (Objective 3.4)
  const bpRiskCholesterol = {
    'Lower Range': { count: 0, totalCholesterol: 0, avgCholesterol: 0, min: Infinity, max: -Infinity },
    'Elevated': { count: 0, totalCholesterol: 0, avgCholesterol: 0, min: Infinity, max: -Infinity },
    'High': { count: 0, totalCholesterol: 0, avgCholesterol: 0, min: Infinity, max: -Infinity }
  };

  // 4. Current Smokers across Age Groups (Objective 4.1)
  const ageGroupAnalysis = {
    '18–29': { total: 0, currentSmokers: 0, smokerPct: 0 },
    '30–44': { total: 0, currentSmokers: 0, smokerPct: 0 },
    '45–59': { total: 0, currentSmokers: 0, smokerPct: 0 },
    '60+': { total: 0, currentSmokers: 0, smokerPct: 0 }
  };

  // 5. Recorded Health Conditions by Smoking Exposure Level (Objective 4.2)
  const exposureConditionMap = {};

  // 6. Regional Distribution
  const regionStats = {};

  // 7. Gender Distribution
  const genderStats = {};

  for (const p of filtered) {
    // Smoking Stats
    if (smokingStats[p.smokingStatus]) {
      smokingStats[p.smokingStatus].count++;
      smokingStats[p.smokingStatus].totalCigs += p.cigarettesPerDay;
    }

    // Organ-wise conditions
    if (!organConditionMap[p.diagnosedOrgan]) {
      organConditionMap[p.diagnosedOrgan] = {
        total: 0,
        conditions: {}
      };
    }
    organConditionMap[p.diagnosedOrgan].total++;
    organConditionMap[p.diagnosedOrgan].conditions[p.healthCondition] =
      (organConditionMap[p.diagnosedOrgan].conditions[p.healthCondition] || 0) + 1;

    // Cholesterol across BP Risk
    if (bpRiskCholesterol[p.bpRiskCategory]) {
      const b = bpRiskCholesterol[p.bpRiskCategory];
      b.count++;
      b.totalCholesterol += p.totalCholesterol;
      if (p.totalCholesterol < b.min) b.min = p.totalCholesterol;
      if (p.totalCholesterol > b.max) b.max = p.totalCholesterol;
    }

    // Age Group & Current Smokers
    if (ageGroupAnalysis[p.ageGroup]) {
      ageGroupAnalysis[p.ageGroup].total++;
      if (p.smokingStatus === 'Current Smoker') {
        ageGroupAnalysis[p.ageGroup].currentSmokers++;
      }
    }

    // Health condition across smoking exposure
    if (!exposureConditionMap[p.smokingExposureCategory]) {
      exposureConditionMap[p.smokingExposureCategory] = {
        total: 0,
        conditions: {}
      };
    }
    exposureConditionMap[p.smokingExposureCategory].total++;
    if (p.hasRecordedCondition) {
      exposureConditionMap[p.smokingExposureCategory].conditions[p.healthCondition] =
        (exposureConditionMap[p.smokingExposureCategory].conditions[p.healthCondition] || 0) + 1;
    }

    // Regional
    if (!regionStats[p.region]) {
      regionStats[p.region] = { total: 0, currentSmokers: 0, recordedCondition: 0 };
    }
    regionStats[p.region].total++;
    if (p.smokingStatus === 'Current Smoker') regionStats[p.region].currentSmokers++;
    if (p.hasRecordedCondition) regionStats[p.region].recordedCondition++;

    // Gender
    if (!genderStats[p.gender]) {
      genderStats[p.gender] = { total: 0, currentSmokers: 0 };
    }
    genderStats[p.gender].total++;
    if (p.smokingStatus === 'Current Smoker') genderStats[p.gender].currentSmokers++;
  }

  // Format Smoking Stats
  const smokingDistributionList = Object.keys(smokingStats).map((status) => {
    const s = smokingStats[status];
    return {
      status,
      count: s.count,
      pct: total ? Number(((s.count / total) * 100).toFixed(1)) : 0,
      avgCigarettesPerDay: s.count ? Number((s.totalCigs / s.count).toFixed(1)) : 0
    };
  });

  // Format Cholesterol across BP Risk
  const cholesterolByBPRiskList = Object.keys(bpRiskCholesterol).map((category) => {
    const b = bpRiskCholesterol[category];
    return {
      category,
      count: b.count,
      avgCholesterol: b.count ? Number((b.totalCholesterol / b.count).toFixed(1)) : 0,
      minCholesterol: b.min === Infinity ? 0 : b.min,
      maxCholesterol: b.max === -Infinity ? 0 : b.max
    };
  });

  // Format Age Group Analysis
  const currentSmokersByAgeGroupList = Object.keys(ageGroupAnalysis).map((group) => {
    const a = ageGroupAnalysis[group];
    return {
      ageGroup: group,
      totalPatients: a.total,
      currentSmokers: a.currentSmokers,
      smokerRatePct: a.total ? Number(((a.currentSmokers / a.total) * 100).toFixed(1)) : 0
    };
  });

  // Format Organ Condition Distribution
  const organDistributionList = Object.keys(organConditionMap).map((organ) => {
    const item = organConditionMap[organ];
    const conditionArray = Object.keys(item.conditions).map((c) => ({
      condition: c,
      count: item.conditions[c],
      pct: item.total ? Number(((item.conditions[c] / item.total) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.count - a.count);

    return {
      organ,
      total: item.total,
      topConditions: conditionArray
    };
  }).sort((a, b) => b.total - a.total);

  // Format Exposure vs Health Conditions
  const exposureConditionList = Object.keys(exposureConditionMap).map((level) => {
    const item = exposureConditionMap[level];
    const condList = Object.keys(item.conditions).map((c) => ({
      condition: c,
      count: item.conditions[c],
      pct: item.total ? Number(((item.conditions[c] / item.total) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.count - a.count);

    return {
      exposureLevel: level,
      totalWithCondition: item.total,
      conditionBreakdown: condList
    };
  });

  // Format Regional Stats
  const regionalList = Object.keys(regionStats).map((r) => ({
    region: r,
    totalPatients: regionStats[r].total,
    currentSmokers: regionStats[r].currentSmokers,
    smokingRatePct: regionStats[r].total ? Number(((regionStats[r].currentSmokers / regionStats[r].total) * 100).toFixed(1)) : 0,
    recordedConditionRatePct: regionStats[r].total ? Number(((regionStats[r].recordedCondition / regionStats[r].total) * 100).toFixed(1)) : 0
  }));

  res.json({
    filteredCount: total,
    totalRecords: patientsData.length,
    smokingDistribution: smokingDistributionList,
    cholesterolByBPRisk: cholesterolByBPRiskList,
    smokersByAgeGroup: currentSmokersByAgeGroupList,
    organDistribution: organDistributionList,
    exposureConditionDistribution: exposureConditionList,
    regionalAnalysis: regionalList,
    genderAnalysis: genderStats
  });
});

// Patient records (paginated & searchable)
app.get('/api/patients', (req, res) => {
  const filtered = filterPatients(patientsData, req.query);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const startIndex = (page - 1) * limit;
  const paginatedPatients = filtered.slice(startIndex, startIndex + limit);

  res.json({
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
    patients: paginatedPatients
  });
});

// Export filtered data as CSV
app.get('/api/patients/export', (req, res) => {
  const filtered = filterPatients(patientsData, req.query);

  const headers = [
    'Patient_ID',
    'Age',
    'Age_Group',
    'Gender',
    'Region',
    'Diagnosis_Date',
    'Smoking_Status',
    'Cigarettes_Per_Day',
    'Years_Smoking',
    'Pack_Years',
    'Smoking_Exposure_Category',
    'Diagnosed_Organ',
    'Health_Condition',
    'Total_Cholesterol_mg_dL',
    'Systolic_BP_mmHg',
    'Diastolic_BP_mmHg',
    'BP_Risk_Category',
    'BMI',
    'Resting_Heart_Rate_bpm'
  ];

  let csvContent = headers.join(',') + '\n';
  for (const p of filtered) {
    const row = [
      p.patientId,
      p.age,
      `"${p.ageGroup}"`,
      `"${p.gender}"`,
      `"${p.region}"`,
      p.diagnosisDate,
      `"${p.smokingStatus}"`,
      p.cigarettesPerDay,
      p.yearsSmoking,
      p.packYears,
      `"${p.smokingExposureCategory}"`,
      `"${p.diagnosedOrgan}"`,
      `"${p.healthCondition}"`,
      p.totalCholesterol,
      p.systolicBP,
      p.diastolicBP,
      `"${p.bpRiskCategory}"`,
      p.bmi,
      p.restingHeartRate
    ];
    csvContent += row.join(',') + '\n';
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="Sapphire_IQ_Smoking_Health_Analysis_Filtered.csv"');
  res.send(csvContent);
});

// DAX & Methodology Documentation Endpoint
app.get('/api/dax-definitions', (req, res) => {
  res.json({
    title: 'Microsoft Power BI DAX Formulas - Smoking and Health Analysis Dashboard',
    author: 'Ricky (Health Data Analyst, Sapphire IQ)',
    projectObjectives: {
      objective1: {
        title: 'Objective 1: Analyze Overall Patient Health Using KPIs',
        measures: [
          {
            name: 'Total Patients',
            dax: 'Total Patients = COUNTROWS(PatientData)',
            description: 'Calculates the total number of patient records in the dataset.'
          },
          {
            name: 'Total Current Smokers',
            dax: "Total Current Smokers = CALCULATE(COUNTROWS(PatientData), PatientData[Smoking_Status] = \"Current Smoker\")",
            description: 'Calculates the total number of currently active smokers.'
          },
          {
            name: 'Patients with Recorded Organ Category',
            dax: "Recorded Organ Patients = CALCULATE(COUNTROWS(PatientData), PatientData[Diagnosed_Organ] <> \"No Recorded Organ Condition\")",
            description: 'Calculates the total patients with an organ diagnosis recorded.'
          },
          {
            name: 'Patients with Recorded Health Condition',
            dax: "Recorded Condition Patients = CALCULATE(COUNTROWS(PatientData), PatientData[Health_Condition] <> \"No Diagnosed Condition\")",
            description: 'Calculates the total patients diagnosed with a specific medical condition.'
          }
        ]
      },
      objective2: {
        title: 'Objective 2: Create Calculated Columns Using DAX',
        calculatedColumns: [
          {
            name: 'Age Group',
            dax: `Age Group = 
SWITCH(
    TRUE(),
    PatientData[Age] >= 18 && PatientData[Age] <= 29, "18–29",
    PatientData[Age] >= 30 && PatientData[Age] <= 44, "30–44",
    PatientData[Age] >= 45 && PatientData[Age] <= 59, "45–59",
    PatientData[Age] >= 60, "60+",
    "Unknown"
)`,
            description: 'Groups patient ages into four distinct epidemiological brackets: 18–29, 30–44, 45–59, and 60+.'
          },
          {
            name: 'BP Risk Category',
            dax: `BP Risk Category = 
SWITCH(
    TRUE(),
    PatientData[Systolic_BP_mmHg] < 120 && PatientData[Diastolic_BP_mmHg] < 80, "Lower Range",
    PatientData[Systolic_BP_mmHg] >= 120 && PatientData[Systolic_BP_mmHg] <= 129 && PatientData[Diastolic_BP_mmHg] < 80, "Elevated",
    PatientData[Systolic_BP_mmHg] >= 130 || PatientData[Diastolic_BP_mmHg] >= 80, "High",
    "Unclassified"
)`,
            description: 'Stratifies patient cardiovascular blood pressure risk into Lower Range (Normal), Elevated, and High based on AHA/ACC systolic and diastolic metrics.'
          },
          {
            name: 'Estimated Smoking Exposure (Pack-Years)',
            dax: `Pack Years = (PatientData[Cigarettes_Per_Day] / 20) * PatientData[Years_Smoking]

Smoking Exposure Category = 
SWITCH(
    TRUE(),
    PatientData[Smoking_Status] = "Never Smoked", "Non-Smoker (0 PY)",
    [Pack Years] = 0, "Past Exposure (Former)",
    [Pack Years] < 10, "Low Exposure (<10 PY)",
    [Pack Years] < 25, "Moderate Exposure (10–24 PY)",
    [Pack Years] >= 25, "Heavy Exposure (25+ PY)",
    "Other"
)`,
            description: 'Calculates cumulative tobacco exposure (pack-years) and groups patients into quantified clinical exposure tiers.'
          }
        ]
      },
      objective3: {
        title: 'Objective 3: Analyze Smoking Patterns and Health Indicators',
        details: [
          'Average cigarettes consumed per day by smoking status.',
          'Organ-wise health condition distribution across Heart, Lungs, Liver, and Kidneys.',
          'Smoking status distribution among patients (Never Smoked, Former Smoker, Current Smoker).',
          'Comparison of average cholesterol levels across blood pressure risk categories.'
        ]
      },
      objective4: {
        title: 'Objective 4: Analyze Patient Demographics and Health Patterns',
        details: [
          'Analysis of current smokers across different age groups (18–29, 30–44, 45–59, 60+).',
          'Distribution of recorded health conditions across estimated smoking exposure levels.'
        ]
      }
    }
  });
});

// Start server after loading data
loadDataset()
  .then(() => {
    startServer(DEFAULT_PORT);
  })
  .catch((err) => {
    console.error('Failed to start server due to data loading error:', err);
    process.exit(1);
  });
