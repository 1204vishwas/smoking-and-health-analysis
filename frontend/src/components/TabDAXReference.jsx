import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  BookOpen, 
  FileText, 
  Printer, 
  ShieldCheck, 
  Database,
  Calculator,
  Layers,
  Sparkles
} from 'lucide-react';

export default function TabDAXReference({ daxData, kpiData }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const daxFormulas = [
    {
      category: 'Objective 1: Key Performance Indicator Measures',
      title: 'Total Patients',
      code: `Total Patients = COUNTROWS('PatientData')`,
      description: 'Calculates the base cohort volume across all records in the registry.'
    },
    {
      category: 'Objective 1: Key Performance Indicator Measures',
      title: 'Total Current Smokers',
      code: `Total Current Smokers = 
CALCULATE(
    COUNTROWS('PatientData'),
    'PatientData'[Smoking_Status] = "Current Smoker"
)`,
      description: 'Counts patients with active smoking status using DAX CALCULATE filter context.'
    },
    {
      category: 'Objective 1: Key Performance Indicator Measures',
      title: 'Patients with Recorded Organ Category',
      code: `Recorded Organ Patients = 
CALCULATE(
    COUNTROWS('PatientData'),
    'PatientData'[Diagnosed_Organ] <> "No Recorded Organ Condition"
)`,
      description: 'Filters out unrecorded organ diagnoses to isolate patients with targeted organ pathology.'
    },
    {
      category: 'Objective 1: Key Performance Indicator Measures',
      title: 'Patients with Recorded Health Condition',
      code: `Recorded Condition Patients = 
CALCULATE(
    COUNTROWS('PatientData'),
    'PatientData'[Health_Condition] <> "No Diagnosed Condition"
)`,
      description: 'Identifies individuals diagnosed with an active clinical pathology.'
    },
    {
      category: 'Objective 2: Calculated Columns Using DAX',
      title: 'Age Group (Calculated Column)',
      code: `Age Group = 
SWITCH(
    TRUE(),
    'PatientData'[Age] >= 18 && 'PatientData'[Age] <= 29, "18–29",
    'PatientData'[Age] >= 30 && 'PatientData'[Age] <= 44, "30–44",
    'PatientData'[Age] >= 45 && 'PatientData'[Age] <= 59, "45–59",
    'PatientData'[Age] >= 60, "60+",
    "Unknown"
)`,
      description: 'Standardized 4-tier demographic categorization used in epidemiology dashboards.'
    },
    {
      category: 'Objective 2: Calculated Columns Using DAX',
      title: 'BP Risk Category (Calculated Column)',
      code: `BP Risk Category = 
SWITCH(
    TRUE(),
    'PatientData'[Systolic_BP_mmHg] < 120 && 'PatientData'[Diastolic_BP_mmHg] < 80, "Lower Range",
    'PatientData'[Systolic_BP_mmHg] >= 120 && 'PatientData'[Systolic_BP_mmHg] <= 129 && 'PatientData'[Diastolic_BP_mmHg] < 80, "Elevated",
    'PatientData'[Systolic_BP_mmHg] >= 130 || 'PatientData'[Diastolic_BP_mmHg] >= 80, "High",
    "Unclassified"
)`,
      description: 'Categorizes patients according to clinical blood pressure risk using systolic and diastolic thresholds.'
    },
    {
      category: 'Objective 2 & 4: Calculated Columns Using DAX',
      title: 'Estimated Smoking Exposure / Pack-Years',
      code: `// Calculated Column: Pack Years
Pack Years = ('PatientData'[Cigarettes_Per_Day] / 20) * 'PatientData'[Years_Smoking]

// Calculated Column: Smoking Exposure Tier
Smoking Exposure Category = 
SWITCH(
    TRUE(),
    'PatientData'[Smoking_Status] = "Never Smoked", "Non-Smoker (0 PY)",
    [Pack Years] = 0, "Past Exposure (Former)",
    [Pack Years] < 10, "Low Exposure (<10 PY)",
    [Pack Years] < 25, "Moderate Exposure (10–24 PY)",
    [Pack Years] >= 25, "Heavy Exposure (25+ PY)",
    "Other"
)`,
      description: 'Quantifies cumulative lifetime tobacco exposure and stratifies patients into clinical risk cohorts.'
    },
    {
      category: 'Objective 3: Smoking Patterns & Indicator Measures',
      title: 'Avg Cigarettes per Day by Status',
      code: `Avg Cigarettes Consumed = 
AVERAGE('PatientData'[Cigarettes_Per_Day])`,
      description: 'Evaluates mean daily consumption sliced by the Smoking_Status column.'
    },
    {
      category: 'Objective 3: Smoking Patterns & Indicator Measures',
      title: 'Avg Cholesterol across BP Categories',
      code: `Avg Total Cholesterol = 
AVERAGE('PatientData'[Total_Cholesterol_mg_dL])`,
      description: 'Evaluates mean total serum cholesterol sliced by the BP Risk Category calculated column.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Power BI Architecture & DAX
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Calculated Columns, Measures & Data Model
          </h2>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-center"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Executive Spec</span>
        </button>
      </div>

      {/* Model Overview Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-blue-400/20">
            <Database className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              Data Model Specification
            </span>
            <h4 className="text-base font-bold text-white">
              Sapphire IQ Microsoft Power BI Semantic Model
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Analyst: Ricky &bull; Dataset: 10,000 Patient Observation Records &bull; Grain: 1 Row per Patient.
              The model utilizes star-schema friendly calculated columns for fast slicer filtering, and explicit DAX measures for executive aggregations.
            </p>
          </div>
        </div>
      </div>

      {/* DAX Code Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {daxFormulas.map((formula, index) => (
          <div 
            key={formula.title}
            className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  {formula.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {formula.title}
                </h4>
              </div>
              <button
                onClick={() => handleCopy(formula.code, index)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs transition-colors cursor-pointer"
                title="Copy DAX Formula"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy DAX</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto">
              <pre className="text-[11px] leading-relaxed text-cyan-300 whitespace-pre">
                {formula.code}
              </pre>
            </div>

            <div className="p-3 bg-white text-xs text-slate-600 border-t border-slate-100">
              <p className="leading-relaxed">{formula.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Executive Report Summary (Ready for Print / PDF Export) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Executive Findings Summary & Report
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Confidential &bull; Sapphire IQ Management Report
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
            <h5 className="font-bold text-slate-900">1. Smoking Exposure & Organ Pathologies</h5>
            <p>
              Analysis of the 10,000 cohort demonstrates an active smoker prevalence of <strong>30.15%</strong> (3,015 patients), consuming an average of <strong>17.5 cigarettes/day</strong>.
              Pulmonary conditions (COPD, Asthma, Reduced Lung Function) and Cardiovascular pathologies (Coronary Artery Disease, Arrhythmia, Heart Failure) represent the predominant diagnosed organ conditions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
            <h5 className="font-bold text-slate-900">2. Blood Pressure & Cholesterol Correlation</h5>
            <p>
              Stratifying patients into clinical BP Risk Categories reveals <strong>60.49%</strong> in the High risk category (&ge;130 mmHg systolic or &ge;80 mmHg diastolic). Total cholesterol remains elevated across categories (Mean 196.9 mg/dL), underscoring the compounding cardiovascular burden in both smoking and non-smoking groups.
            </p>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 italic text-center">
          Report prepared by Ricky &bull; Sapphire IQ &bull; Microsoft Power BI Healthcare Analytics Platform
        </div>
      </div>
    </div>
  );
}
