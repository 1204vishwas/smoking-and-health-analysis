import React from 'react';
import { 
  Activity, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  BarChart3,
  Layers
} from 'lucide-react';

export default function Header({ 
  totalRecords, 
  filteredCount, 
  onResetFilters, 
  onExportCSV, 
  searchTerm, 
  onSearchChange,
  isLoading
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Matching PDF Presentation Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 lg:px-8 py-2 text-xs flex flex-wrap justify-between items-center gap-2 border-b border-blue-800/40">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-cyan-300 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SAPPHIRE IQ
          </span>
          <span className="text-slate-400">|</span>
          <span className="tracking-wider text-slate-200 font-medium uppercase text-[11px]">
            HEALTHCARE ANALYTICS
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 text-[11px]">
          <span className="hidden sm:inline text-slate-400">
            SAPPHIRE IQ &bull; Brilliant Minds Intelligent Solutions
          </span>
          <span className="bg-blue-800/60 text-cyan-200 px-2 py-0.5 rounded text-[10px] font-semibold border border-blue-700/60">
            PROJECT PRESENTATION &bull; POWER BI
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title and Project Details */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Project Title
                </span>
                <span className="text-xs text-slate-500">Domain: Healthcare Analytics</span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs font-medium text-slate-600">Tool: Microsoft Power BI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Smoking and Health Analysis Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
                Health Data Analyst Ricky's interactive report at Sapphire IQ for management to monitor patient KPIs, 
                smoking patterns, organ condition comparisons, and health indicators.
              </p>
            </div>
          </div>

          {/* Quick Stats & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start lg:self-center">
            {/* Search Box */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient ID, organ..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Reset Button */}
            <button
              onClick={onResetFilters}
              disabled={isLoading}
              title="Reset all filters"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Reset</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Print / Report PDF View */}
            <button
              onClick={() => window.print()}
              className="no-print flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Data Badge & Disclaimer Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {filteredCount.toLocaleString()} / {totalRecords.toLocaleString()} Patients Filtered
            </span>
            <span className="text-slate-400 hidden sm:inline">&bull;</span>
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              Ricky &bull; Health Data Analyst, Sapphire IQ
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 italic">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Designed for exploratory & educational analysis; does not establish medical diagnoses.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
