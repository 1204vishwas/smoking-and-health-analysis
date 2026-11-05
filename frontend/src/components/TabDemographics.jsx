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
  Users, 
  Flame, 
  Activity, 
  ShieldAlert, 
  Layers, 
  Filter, 
  TrendingUp, 
  ChevronRight,
  HeartCrack
} from 'lucide-react';

export default function TabDemographics({ overviewData, kpiData }) {
  const [selectedExposure, setSelectedExposure] = useState('All');

  if (!overviewData) {
    return <div className="p-8 text-center text-slate-400">Loading demographics...</div>;
  }

  const smokersByAgeGroup = overviewData.smokersByAgeGroup || [];
  const exposureConditionDistribution = overviewData.exposureConditionDistribution || [];
  const regionalAnalysis = overviewData.regionalAnalysis || [];
  const genderAnalysis = overviewData.genderAnalysis || {};

  // Format gender for charts
  const genderData = Object.keys(genderAnalysis).map((g) => ({
    gender: g,
    total: genderAnalysis[g].total,
    currentSmokers: genderAnalysis[g].currentSmokers,
    smokerRatePct: genderAnalysis[g].total
      ? Number(((genderAnalysis[g].currentSmokers / genderAnalysis[g].total) * 100).toFixed(1))
      : 0
  }));

  // Selected exposure condition breakdown
  const currentExposureObj = selectedExposure === 'All'
    ? null
    : exposureConditionDistribution.find((e) => e.exposureLevel === selectedExposure);

  const exposureChartData = currentExposureObj
    ? currentExposureObj.conditionBreakdown.slice(0, 8)
    : exposureConditionDistribution.map((e) => ({
        exposureLevel: e.exposureLevel,
        totalWithCondition: e.totalWithCondition,
        topCondition: e.conditionBreakdown[0]?.condition || 'None',
        topConditionCount: e.conditionBreakdown[0]?.count || 0
      }));

  const COLORS_EXPOSURE = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Objective Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Objective 4 Analysis
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Patient Demographics and Health Patterns
          </h2>
        </div>
        <div className="text-xs text-slate-500">
          Age-stratified tobacco consumption & disease prevalence across cumulative exposure tiers
        </div>
      </div>

      {/* Grid Row 1: Objective 4.1 & Objective 4.2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objective 4.1: Current Smokers Across Age Groups */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    1. Current Smokers Across Different Age Groups
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated column Age Group (18–29, 30–44, 45–59, 60+)
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                Objective 4.1
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={smokersByAgeGroup} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val.toLocaleString()} current smokers (Rate: ${item.payload.smokerRatePct}%, Total Cohort: ${item.payload.totalPatients.toLocaleString()})`,
                    'Current Smokers'
                  ]}
                />
                <Bar dataKey="currentSmokers" fill="#EF4444" radius={[6, 6, 0, 0]} name="Smokers Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age Group Metric Table */}
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
            {smokersByAgeGroup.map((a) => (
              <div key={a.ageGroup} className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700">{a.ageGroup} yrs</div>
                <div className="font-extrabold text-rose-600 text-sm mt-0.5">
                  {a.currentSmokers.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">
                  {a.smokerRatePct}% rate ({a.totalPatients})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objective 4.2: Distribution of Recorded Health Conditions Across Smoking Exposure */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    2. Conditions Across Smoking Exposure Levels
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pack-Years Index: (Cigs/Day ÷ 20) &times; Years Smoking
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded self-start sm:self-center">
                Objective 4.2
              </span>
            </div>

            {/* Exposure Tier Selectors */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedExposure('All')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  selectedExposure === 'All'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Tiers
              </button>
              {exposureConditionDistribution.map((e) => (
                <button
                  key={e.exposureLevel}
                  onClick={() => setSelectedExposure(e.exposureLevel)}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                    selectedExposure === e.exposureLevel
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {e.exposureLevel} ({e.totalWithCondition})
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {selectedExposure === 'All' ? (
                <BarChart data={exposureChartData} margin={{ top: 15, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="exposureLevel" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val, name, item) => [
                      `${val.toLocaleString()} patients with condition (Top: ${item.payload.topCondition} - ${item.payload.topConditionCount})`,
                      'Patients'
                    ]}
                  />
                  <Bar dataKey="totalWithCondition" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Patients" />
                </BarChart>
              ) : (
                <BarChart data={exposureChartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="condition" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip 
                    formatter={(val, name, item) => [
                      `${val.toLocaleString()} patients (${item.payload.pct}%)`,
                      'Cases'
                    ]}
                  />
                  <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Diagnoses" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>
              {selectedExposure === 'All' 
                ? 'Exposure tiers: Non-Smoker, Past Exposure, Low, Moderate, Heavy' 
                : `Top conditions diagnosed under ${selectedExposure}`}
            </span>
            <span className="font-semibold text-purple-700">
              {selectedExposure === 'All' ? '5 Exposure Tiers' : `${currentExposureObj?.conditionBreakdown?.length || 0} Pathologies`}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Demographic In-Depth (Gender & Regional Correlations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Gender Demographics & Smoking Prevalence</h4>
            <p className="text-xs text-slate-500 mt-1">Cross-tabulation of patient gender against active smoking</p>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="gender" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val, name, item) => [
                    `${val.toLocaleString()} (${name === 'currentSmokers' ? `${item.payload.smokerRatePct}% rate` : ''})`,
                    name === 'total' ? 'Total Cohort' : 'Current Smokers'
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="total" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Total Patients" />
                <Bar dataKey="currentSmokers" fill="#EF4444" radius={[4, 4, 0, 0]} name="Current Smokers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            {genderData.map((g) => (
              <div key={g.gender} className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-slate-700">{g.gender}</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{g.total.toLocaleString()}</p>
                <p className="text-[10px] text-rose-600 font-semibold">{g.smokerRatePct}% Smokers</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Pathology Rates */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Regional Disease & Smoking Patterns</h4>
            <p className="text-xs text-slate-500 mt-1">Comparing smoking rates vs diagnosed condition rates across regions</p>
          </div>

          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalAnalysis} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip 
                  formatter={(val, name) => [`${val}%`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="smokingRatePct" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Smoking Rate %" />
                <Bar dataKey="recordedConditionRatePct" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Condition Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>Overall condition prevalence is consistent across all regions (~57–58%)</span>
            <span className="font-semibold text-blue-700">5 Geographic Zones</span>
          </div>
        </div>
      </div>
    </div>
  );
}
