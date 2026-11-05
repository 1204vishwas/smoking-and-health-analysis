import React from 'react';
import { 
  X, 
  User, 
  Activity, 
  Heart, 
  Scale, 
  Calendar, 
  MapPin, 
  Cigarette, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function PatientDetailModal({ patient, onClose }) {
  if (!patient) return null;

  const isSmoker = patient.smokingStatus === 'Current Smoker';
  const isFormer = patient.smokingStatus === 'Former Smoker';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-mono font-bold text-cyan-300">
              {patient.patientId.slice(2, 6)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {patient.patientId}
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-800 text-cyan-200 border border-blue-700">
                  Electronic Health Record
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {patient.gender} &bull; {patient.age} years ({patient.ageGroup}) &bull; {patient.region} Region
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Diagnostic Card Banner */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Primary Diagnosis & Organ
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {patient.healthCondition}
              </h4>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Organ: {patient.diagnosedOrgan}</span>
              </p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Diagnosis Date
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.diagnosisDate}</span>
              </span>
            </div>
          </div>

          {/* Clinical Vital Signs Grid */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Biometric & Cardiovascular Profile</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* BP */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Blood Pressure
                </span>
                <span className="text-base font-extrabold text-slate-900 block mt-1">
                  {patient.systolicBP}/{patient.diastolicBP}
                </span>
                <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  patient.bpRiskCategory === 'High' 
                    ? 'bg-rose-100 text-rose-800' 
                    : patient.bpRiskCategory === 'Elevated' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {patient.bpRiskCategory}
                </span>
              </div>

              {/* Cholesterol */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Cholesterol
                </span>
                <span className="text-base font-extrabold text-slate-900 block mt-1">
                  {patient.totalCholesterol}
                </span>
                <span className="text-[10px] text-slate-500 block">mg/dL</span>
              </div>

              {/* BMI */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Body Mass Index
                </span>
                <span className="text-base font-extrabold text-slate-900 block mt-1">
                  {patient.bmi}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {patient.bmi >= 30 ? 'Obese' : patient.bmi >= 25 ? 'Overweight' : 'Normal'}
                </span>
              </div>

              {/* Heart Rate */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Resting Heart Rate
                </span>
                <span className="text-base font-extrabold text-slate-900 block mt-1">
                  {patient.restingHeartRate}
                </span>
                <span className="text-[10px] text-slate-500 block">bpm</span>
              </div>
            </div>
          </div>

          {/* Smoking & Tobacco History */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cigarette className="w-4 h-4 text-rose-600" />
              <span>Smoking & Tobacco History</span>
            </h5>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    isSmoker 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : isFormer 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {patient.smokingStatus}
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    Tier: <strong className="text-slate-900">{patient.smokingExposureCategory}</strong>
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Calculated Pack-Years: <strong className="text-slate-900 font-mono">{patient.packYears} PY</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Daily Intake</span>
                  <span className="font-bold text-slate-800">{patient.cigarettesPerDay} cigs/day</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Years Smoking</span>
                  <span className="font-bold text-slate-800">{patient.yearsSmoking} years ({patient.smokingYearsBracket})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Lifetime Cigarettes (Est.)</span>
                  <span className="font-bold text-slate-800">
                    {(patient.cigarettesPerDay * 365 * patient.yearsSmoking).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Patient ID: {patient.patientId} &bull; Sapphire IQ Analytics Record</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
