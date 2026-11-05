import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  Eye, 
  Activity, 
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import PatientDetailModal from './PatientDetailModal';

export default function TabPatientExplorer({
  patients,
  totalPatients,
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
  searchTerm,
  onSearchChange,
  onExportCSV,
  isLoading
}) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Current Smoker':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Former Smoker':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Never Smoked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getBPRiskBadge = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-rose-100 text-rose-800 font-bold';
      case 'Elevated':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'Lower Range':
        return 'bg-emerald-100 text-emerald-800 font-medium';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Header & Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Patient Data Explorer
          </h3>
          <p className="text-xs text-slate-500">
            Showing {((page - 1) * limit + 1).toLocaleString()} – {Math.min(page * limit, totalPatients).toLocaleString()} of {totalPatients.toLocaleString()} records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rows per page selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Filtered ({totalPatients.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-3">Patient ID</th>
                <th className="py-3 px-3">Age / Group</th>
                <th className="py-3 px-2">Gender</th>
                <th className="py-3 px-3">Region</th>
                <th className="py-3 px-3">Smoking Status</th>
                <th className="py-3 px-2">Cigs/Day</th>
                <th className="py-3 px-2">Years</th>
                <th className="py-3 px-3">Pack-Years</th>
                <th className="py-3 px-3">Organ</th>
                <th className="py-3 px-4">Health Condition</th>
                <th className="py-3 px-3">Blood Pressure</th>
                <th className="py-3 px-2">BP Risk</th>
                <th className="py-3 px-3">Cholesterol</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="14" className="py-12 text-center text-slate-400">
                    <Activity className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>Loading patient records...</span>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="14" className="py-12 text-center text-slate-400">
                    No patient records matched the active filter criteria.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr 
                    key={p.patientId} 
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedPatient(p)}
                  >
                    {/* Patient ID */}
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600 group-hover:underline">
                      {p.patientId}
                    </td>

                    {/* Age / Group */}
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-900">{p.age}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{p.ageGroup}</span>
                    </td>

                    {/* Gender */}
                    <td className="py-2.5 px-2">{p.gender}</td>

                    {/* Region */}
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{p.region}</span>
                    </td>

                    {/* Smoking Status */}
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(p.smokingStatus)}`}>
                        {p.smokingStatus}
                      </span>
                    </td>

                    {/* Cigs/Day */}
                    <td className="py-2.5 px-2 font-mono">
                      {p.cigarettesPerDay > 0 ? (
                        <span className="font-bold text-rose-600">{p.cigarettesPerDay}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* Years Smoking */}
                    <td className="py-2.5 px-2 font-mono text-slate-600">
                      {p.yearsSmoking}
                    </td>

                    {/* Pack Years */}
                    <td className="py-2.5 px-3 font-mono">
                      <span className="font-semibold text-slate-800">{p.packYears}</span>
                      <span className="text-[9px] text-slate-400 block truncate">{p.smokingExposureCategory}</span>
                    </td>

                    {/* Organ */}
                    <td className="py-2.5 px-3">
                      <span className={`font-medium ${
                        p.diagnosedOrgan === 'No Recorded Organ Condition'
                          ? 'text-slate-400 italic'
                          : 'text-indigo-700'
                      }`}>
                        {p.diagnosedOrgan === 'No Recorded Organ Condition' ? 'None' : p.diagnosedOrgan}
                      </span>
                    </td>

                    {/* Health Condition */}
                    <td className="py-2.5 px-4">
                      <span className={`font-semibold ${
                        p.healthCondition === 'No Diagnosed Condition' 
                          ? 'text-slate-400' 
                          : 'text-slate-900'
                      }`}>
                        {p.healthCondition}
                      </span>
                    </td>

                    {/* BP */}
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {p.systolicBP}/{p.diastolicBP}
                    </td>

                    {/* BP Risk */}
                    <td className="py-2.5 px-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${getBPRiskBadge(p.bpRiskCategory)}`}>
                        {p.bpRiskCategory}
                      </span>
                    </td>

                    {/* Cholesterol */}
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {p.totalCholesterol}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-2 text-center" onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); }}>
                      <button 
                        className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors cursor-pointer"
                        title="View Patient Record"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Page <span className="font-bold text-slate-900">{page}</span> of <span className="font-bold text-slate-900">{totalPages || 1}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1 || isLoading}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded font-medium hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              First
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded">
              {page}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages || isLoading}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded font-medium hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
