import React, { useState } from 'react';
import { Filter, ChevronDown, RotateCcw, X, SlidersHorizontal, Check } from 'lucide-react';

export default function FilterBar({ filters, onFilterChange, onResetFilters }) {
  const [isOpen, setIsOpen] = useState(true);

  const regionOptions = ['All', 'Central', 'East', 'North', 'South', 'West'];
  const genderOptions = ['All', 'Female', 'Male', 'Other'];
  const ageGroupOptions = ['All', '18–29', '30–44', '45–59', '60+'];
  const smokingOptions = ['All', 'Current Smoker', 'Former Smoker', 'Never Smoked'];
  const bpRiskOptions = ['All', 'Lower Range', 'Elevated', 'High'];
  const organOptions = [
    'All',
    'Heart',
    'Lungs',
    'Liver',
    'Kidneys',
    'No Recorded Organ Condition'
  ];
  const conditionOptions = [
    'All',
    'Coronary Artery Disease',
    'Heart Failure',
    'Arrhythmia',
    'Asthma',
    'COPD',
    'Reduced Lung Function',
    'Fatty Liver',
    'Liver Inflammation',
    'Reduced Liver Function',
    'Chronic Kidney Disease',
    'Kidney Stones',
    'Reduced Kidney Function',
    'Hypertension',
    'High Cholesterol',
    'Type 2 Diabetes',
    'No Diagnosed Condition'
  ];
  const exposureOptions = [
    'All',
    'Non-Smoker (0 PY)',
    'Past Exposure (Former)',
    'Low Exposure (<10 PY)',
    'Moderate Exposure (10–24 PY)',
    'Heavy Exposure (25+ PY)'
  ];

  // Count active filters (non-'All' and non-empty)
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'All' && key !== 'search'
  ).length;

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
        {/* Slicer Toggle & Summary */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Power BI Slicers & Filters</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {activeCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                {activeCount} active filter{activeCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {activeCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Collapsible Slicer Grid */}
        {isOpen && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-3 border-t border-slate-100">
            {/* Region */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Region
              </label>
              <select
                value={filters.region || 'All'}
                onChange={(e) => onFilterChange('region', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {regionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Gender
              </label>
              <select
                value={filters.gender || 'All'}
                onChange={(e) => onFilterChange('gender', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {genderOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Age Group (DAX)
              </label>
              <select
                value={filters.ageGroup || 'All'}
                onChange={(e) => onFilterChange('ageGroup', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {ageGroupOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Smoking Status */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Smoking Status
              </label>
              <select
                value={filters.smokingStatus || 'All'}
                onChange={(e) => onFilterChange('smokingStatus', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {smokingOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* BP Risk Category */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                BP Risk (DAX)
              </label>
              <select
                value={filters.bpRisk || 'All'}
                onChange={(e) => onFilterChange('bpRisk', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {bpRiskOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnosed Organ */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Organ
              </label>
              <select
                value={filters.organ || 'All'}
                onChange={(e) => onFilterChange('organ', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {organOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'No Recorded Organ Condition' ? 'None Recorded' : opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Exposure Tier */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Smoking Exposure
              </label>
              <select
                value={filters.exposureCategory || 'All'}
                onChange={(e) => onFilterChange('exposureCategory', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white"
              >
                {exposureOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Health Condition */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Health Condition
              </label>
              <select
                value={filters.condition || 'All'}
                onChange={(e) => onFilterChange('condition', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white truncate"
              >
                {conditionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
