import React from 'react';
import { 
  Users, 
  Cigarette, 
  HeartPulse, 
  Stethoscope, 
  Activity, 
  Scale, 
  Flame, 
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Heart,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function TabOverview({ kpiData, overviewData, onNavigateTab }) {
  if (!kpiData) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400">
        <Activity className="w-6 h-6 animate-spin mr-2 text-blue-600" />
        <span>Loading executive metrics...</span>
      </div>
    );
  }

  // Colors
  const COLORS_SMOKING = {
    'Never Smoked': '#10B981',    // emerald
    'Former Smoker': '#F59E0B',   // amber
    'Current Smoker': '#EF4444'   // rose/red
  };

  const COLORS_BP = {
    'Lower Range': '#10B981',     // emerald (normal)
    'Elevated': '#F59E0B',        // amber
    'High': '#EF4444'             // red
  };

  const smokingPieData = overviewData?.smokingDistribution || [];
  const bpRiskData = overviewData?.cholesterolByBPRisk || [];
  const regionalData = overviewData?.regionalAnalysis || [];
  const smokersAgeGroupData = overviewData?.smokersByAgeGroup || [];

  return (
    <div className="space-y-6">
      {/* Objective 1: Primary KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Objective 1: Key Patient Performance Indicators (KPIs)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Calculated via Power BI DAX Measures
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Patients */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  1. Total Patients
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {kpiData.totalPatients?.toLocaleString() ?? 0}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-blue-600">COUNTROWS</span>
              <span>on patient register dataset</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
          </div>

          {/* KPI 2: Total Current Smokers */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-rose-400 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  2. Current Smokers
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                    {kpiData.currentSmokers?.toLocaleString() ?? 0}
                  </h3>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {kpiData.currentSmokersPct}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Cigarette className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-slate-600">
                Former: {kpiData.formerSmokers?.toLocaleString()} ({kpiData.formerSmokersPct}%)
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
          </div>

          {/* KPI 3: Recorded Organ Category */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  3. Recorded Organ
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
                    {kpiData.recordedOrganPatients?.toLocaleString() ?? 0}
                  </h3>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                    {kpiData.recordedOrganPct}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Heart, Lungs, Liver, Kidneys diagnosed</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
          </div>

          {/* KPI 4: Recorded Health Condition */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  4. Recorded Condition
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                    {kpiData.recordedConditionPatients?.toLocaleString() ?? 0}
                  </h3>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {kpiData.recordedConditionPct}%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Specific pathology recorded (16 conditions)</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
          </div>
        </div>
      </div>

      {/* Secondary Clinical Vitals Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              Cohort Biometric Baseline
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              Population Vitals & Clinical Benchmarks
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full md:w-auto">
            <div className="border-l border-slate-700 pl-3">
              <span className="text-[11px] text-slate-400 block">Avg Blood Pressure</span>
              <span className="text-base font-extrabold text-cyan-300">
                {kpiData.avgSystolicBP} / {kpiData.avgDiastolicBP}
              </span>
              <span className="text-[10px] text-slate-400 block">mmHg</span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-[11px] text-slate-400 block">Avg Cholesterol</span>
              <span className="text-base font-extrabold text-emerald-300">
                {kpiData.avgCholesterol}
              </span>
              <span className="text-[10px] text-slate-400 block">mg/dL</span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-[11px] text-slate-400 block">Average BMI</span>
              <span className="text-base font-extrabold text-amber-300">
                {kpiData.avgBMI}
              </span>
              <span className="text-[10px] text-slate-400 block">kg/m²</span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-[11px] text-slate-400 block">Resting Heart Rate</span>
              <span className="text-base font-extrabold text-rose-300">
                {kpiData.avgHeartRate}
              </span>
              <span className="text-[10px] text-slate-400 block">bpm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Objective 2: DAX Calculated Columns Showcase */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Objective 2: Power BI Calculated Columns Using DAX
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('dax')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full DAX Code</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Calculated Column 1: Age Group */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[11px] rounded">
                  DAX Column 1
                </span>
                <span className="font-bold text-slate-800 text-sm">Age Group</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">18–29, 30–44, 45–59, 60+</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Groups patients into epidemiological life stages using a <code className="text-blue-700 bg-blue-50 px-1 rounded">SWITCH(TRUE(), ...)</code> construct.
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
              {smokersAgeGroupData.map((item) => (
                <div key={item.ageGroup} className="bg-white p-2 rounded border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600">{item.ageGroup}</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">{item.totalPatients}</div>
                  <div className="text-[10px] text-slate-400">Patients</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculated Column 2: BP Risk Category */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded">
                  DAX Column 2
                </span>
                <span className="font-bold text-slate-800 text-sm">BP Risk Category</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Lower Range, Elevated, High</span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Classifies systolic and diastolic readings according to standard American Heart Association cardiology brackets.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {bpRiskData.map((b) => (
                <div key={b.category} className="bg-white p-2 rounded border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600">{b.category}</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">{b.count}</div>
                  <div className="text-[10px] text-slate-400">{b.avgCholesterol} mg/dL Chol</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visuals Row: High Level Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smoking Status Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">Smoking Status Distribution</h4>
              <span className="text-xs text-slate-400">Objective 3.3</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Breakdown of patient smoking habit profile</p>
          </div>
          <div className="h-60 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={smokingPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                >
                  {smokingPieData.map((entry) => (
                    <Cell 
                      key={entry.status} 
                      fill={COLORS_SMOKING[entry.status] || '#3B82F6'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val, name, item) => [`${val.toLocaleString()} (${item.payload.pct}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            {smokingPieData.map((item) => (
              <div key={item.status}>
                <span 
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: COLORS_SMOKING[item.status] || '#3B82F6' }}
                ></span>
                <span className="font-bold text-slate-800">{item.pct}%</span>
                <p className="text-[10px] text-slate-500 truncate">{item.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Smokers Across Age Groups */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">Smokers by Age Group</h4>
              <span className="text-xs text-slate-400">Objective 4.1</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Current smokers count across DAX age brackets</p>
          </div>
          <div className="h-60 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={smokersAgeGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val.toLocaleString()} smokers (${item.payload.smokerRatePct}% smoker rate)`,
                    'Current Smokers'
                  ]}
                />
                <Bar dataKey="currentSmokers" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Highest active cohort: <strong className="text-slate-800">60+ years</strong></span>
            <span className="text-blue-600 font-semibold">Rate: ~30.1%</span>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">Regional Patient Breakdown</h4>
              <span className="text-xs text-slate-400">Demographics</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Geographic distribution across 5 territories</p>
          </div>
          <div className="h-60 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} width={55} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val.toLocaleString()} patients (${item.payload.smokingRatePct}% smokers)`,
                    'Total Patients'
                  ]}
                />
                <Bar dataKey="totalPatients" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>North & West represent top cohorts</span>
            </span>
            <span className="text-slate-700 font-semibold">5 Regions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
