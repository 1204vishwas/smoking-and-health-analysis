import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Cigarette, 
  Heart, 
  Activity, 
  Scale, 
  AlertCircle, 
  Filter, 
  Layers,
  ChevronRight,
  TrendingUp,
  Stethoscope
} from 'lucide-react';

export default function TabSmokingPatterns({ overviewData, kpiData }) {
  const [selectedOrgan, setSelectedOrgan] = useState('All');

  if (!overviewData) {
    return <div className="p-8 text-center text-slate-400">Loading smoking analysis...</div>;
  }

  const smokingDistribution = overviewData.smokingDistribution || [];
  const cholesterolByBPRisk = overviewData.cholesterolByBPRisk || [];
  const organDistribution = overviewData.organDistribution || [];

  // Filtered organ data for drill-down
  const currentOrganObj = selectedOrgan === 'All'
    ? null
    : organDistribution.find((o) => o.organ === selectedOrgan);

  const organBarData = currentOrganObj
    ? currentOrganObj.topConditions.slice(0, 8)
    : organDistribution.map((o) => ({
        organ: o.organ === 'No Recorded Organ Condition' ? 'No Organ Cond.' : o.organ,
        total: o.total,
        topCondition: o.topConditions[0]?.condition || 'None',
        topConditionCount: o.topConditions[0]?.count || 0
      }));

  const COLORS_STATUS = ['#10B981', '#F59E0B', '#EF4444'];
  const COLORS_BP = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Objective Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Objective 3 Analysis
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Smoking Patterns and Health Indicators
          </h2>
        </div>
        <div className="text-xs text-slate-500">
          Comparing tobacco intake against cardiovascular, pulmonary, hepatic & renal pathologies
        </div>
      </div>

      {/* Grid Row 1: Objective 3.1 & Objective 3.3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objective 3.1: Average Cigarettes Per Day by Smoking Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Cigarette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    1. Average Cigarettes Consumed Per Day
                  </h3>
                  <p className="text-xs text-slate-500">Analyzed by Smoking Status Category</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                Objective 3.1
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={smokingDistribution} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Cigs / Day', angle: -90, position: 'insideLeft', fontSize: 11, offset: 15 }} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val} cigarettes / day (${item.payload.count.toLocaleString()} patients)`,
                    'Avg Consumption'
                  ]}
                />
                <Bar dataKey="avgCigarettesPerDay" fill="#EF4444" radius={[6, 6, 0, 0]} name="Avg Cigarettes/Day" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-800">Current Smokers Intake:</span>{' '}
              <strong className="text-rose-600">
                {smokingDistribution.find(s => s.status === 'Current Smoker')?.avgCigarettesPerDay || 0} cigs/day
              </strong>
            </div>
            <div className="text-slate-500 text-[11px]">
              Former Smokers & Never Smoked = 0 cigs/day daily consumption
            </div>
          </div>
        </div>

        {/* Objective 3.3: Smoking Status Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    2. Smoking Status Distribution
                  </h3>
                  <p className="text-xs text-slate-500">Patient cohort proportion by smoking history</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                Objective 3.3
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={smokingDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  dataKey="count"
                  nameKey="status"
                  paddingAngle={4}
                  label={({ status, pct }) => `${pct}%`}
                  labelLine={false}
                >
                  {smokingDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS_STATUS[index % COLORS_STATUS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val.toLocaleString()} patients (${item.payload.pct}%)`,
                    name
                  ]}
                />
                <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {smokingDistribution.map((s, idx) => (
              <div key={s.status} className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700 truncate">{s.status}</div>
                <div className="font-extrabold text-slate-900 mt-0.5">{s.count.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">{s.pct}% cohort</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Objective 3.2 & Objective 3.4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objective 3.2: Organ-wise Health Condition Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    3. Organ-Wise Health Condition Distribution
                  </h3>
                  <p className="text-xs text-slate-500">Pathology distribution across diagnosed organs</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded self-start sm:self-center">
                Objective 3.2
              </span>
            </div>

            {/* Organ Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedOrgan('All')}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  selectedOrgan === 'All'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Organs
              </button>
              {organDistribution.map((o) => (
                <button
                  key={o.organ}
                  onClick={() => setSelectedOrgan(o.organ)}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    selectedOrgan === o.organ
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {o.organ === 'No Recorded Organ Condition' ? 'No Organ Cond.' : o.organ} ({o.total})
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {selectedOrgan === 'All' ? (
                <BarChart data={organBarData} margin={{ top: 15, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="organ" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val, name, item) => [
                      `${val.toLocaleString()} patients (Top: ${item.payload.topCondition} - ${item.payload.topConditionCount})`,
                      'Patients Diagnosed'
                    ]}
                  />
                  <Bar dataKey="total" fill="#6366F1" radius={[6, 6, 0, 0]} name="Patients" />
                </BarChart>
              ) : (
                <BarChart data={organBarData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="condition" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip 
                    formatter={(val, name, item) => [
                      `${val.toLocaleString()} patients (${item.payload.pct}%)`,
                      'Cases'
                    ]}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} name="Diagnoses" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>
              {selectedOrgan === 'All' 
                ? 'Showing total patients by recorded organ category' 
                : `Condition breakdown for ${selectedOrgan}`}
            </span>
            <span className="font-semibold text-indigo-700">
              {selectedOrgan === 'All' ? `${organDistribution.length} Categories` : `${currentOrganObj?.topConditions?.length || 0} Diagnoses`}
            </span>
          </div>
        </div>

        {/* Objective 3.4: Cholesterol Levels Across BP Risk Categories */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    4. Average Cholesterol Across BP Risk Categories
                  </h3>
                  <p className="text-xs text-slate-500">Cross-analyzing lipid profile and blood pressure severity</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                Objective 3.4
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cholesterolByBPRisk} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis domain={[100, 240]} tick={{ fontSize: 11 }} label={{ value: 'mg/dL', angle: -90, position: 'insideLeft', fontSize: 11, offset: 15 }} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val} mg/dL (Range: ${item.payload.minCholesterol}–${item.payload.maxCholesterol} mg/dL, Count: ${item.payload.count.toLocaleString()})`,
                    'Avg Total Cholesterol'
                  ]}
                />
                <Bar dataKey="avgCholesterol" fill="#0EA5E9" radius={[6, 6, 0, 0]} name="Avg Cholesterol" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {cholesterolByBPRisk.map((b) => (
              <div key={b.category} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700">{b.category}</div>
                <div className="font-extrabold text-blue-700 text-sm mt-0.5">{b.avgCholesterol} mg/dL</div>
                <div className="text-[10px] text-slate-400">n = {b.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
