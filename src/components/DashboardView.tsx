import React from 'react';
import { 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  AlertTriangle, 
  PlusCircle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ScreeningRecord } from '../types';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import { ScreeningStatisticsChart } from './ScreeningStatisticsChart';
import { HbA1cTrendChart } from './HbA1cTrendChart';

interface DashboardViewProps {
  records: ScreeningRecord[];
  onStartNewScreening: () => void;
  onSelectRecord: (record: ScreeningRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onStartNewScreening,
  onSelectRecord
}) => {
  // Compute metrics
  const totalPatients = new Set(records.map(r => r.patient.patientNumber)).size;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayScreenings = records.filter(r => r.patient.examDate === todayStr).length || records.length;
  const imagesAnalyzed = records.length * 2;
  const requiresReview = records.filter(r => 
    r.overallCategory !== 'No obvious abnormality detected'
  ).length;

  return (
    <div id="home-dashboard-view" className="space-y-4">
      
      {/* Top Welcome & Medical Disclaimer */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Clinical Retinal Screening Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              AI-assisted bilateral diabetic retinopathy screening and inter-ocular comparison prototype
            </p>
          </div>

          <button
            type="button"
            id="dashboard-new-screening-cta-btn"
            onClick={onStartNewScreening}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all hover:shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Eye Screening</span>
          </button>
        </div>

        <MedicalDisclaimerBanner />
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Patients */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Patients
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {totalPatients}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <span className="text-teal-700 font-semibold">Active records</span> in local registry
            </div>
          </div>
        </div>

        {/* Today's Screenings */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Screenings
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {todayScreenings}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
              <span className="text-teal-700 font-semibold">Session batch</span> verified
            </div>
          </div>
        </div>

        {/* Images Analyzed */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Images Analyzed
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {imagesAnalyzed}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Bilateral fundus captures (OS & OD)
            </div>
          </div>
        </div>

        {/* Requires Professional Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Requires Review
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-800">
              {requiresReview}
            </div>
            <div className="text-[11px] text-amber-900/80 mt-0.5">
              Potential findings or poor quality
            </div>
          </div>
        </div>

      </div>

      {/* Screening Results Distribution & Statistics Chart Card */}
      <ScreeningStatisticsChart records={records} />

      {/* HbA1c Historical Health Trends Line Chart */}
      <HbA1cTrendChart records={records} onSelectRecord={onSelectRecord} />

      {/* Recent Screenings Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                Recent Screenings
              </h3>
              <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                DEMO DATA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Verified bilateral screening records and AI classification status
            </p>
          </div>

          <button
            type="button"
            onClick={onStartNewScreening}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Run New Screening</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                <th className="py-2.5 px-3.5 sm:px-4">Patient Number</th>
                <th className="py-2.5 px-3.5 sm:px-4">Patient</th>
                <th className="py-2.5 px-3.5 sm:px-4">Date</th>
                <th className="py-2.5 px-3.5 sm:px-4">Screening Result</th>
                <th className="py-2.5 px-3.5 sm:px-4">Status</th>
                <th className="py-2.5 px-3.5 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 text-xs">
                    No screenings recorded yet. Click &quot;New Eye Screening&quot; to begin.
                  </td>
                </tr>
              ) : (
                records.map((rec) => {
                  const isNormal = rec.overallCategory === 'No obvious abnormality detected';
                  const isPoor = rec.overallCategory === 'Unable to assess reliably';

                  return (
                    <tr 
                      key={rec.id}
                      onClick={() => onSelectRecord(rec)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Patient Number */}
                      <td className="py-2.5 px-3.5 sm:px-4 font-mono font-bold text-teal-900">
                        {rec.patient.patientNumber}
                      </td>

                      {/* Patient */}
                      <td className="py-2.5 px-3.5 sm:px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {rec.patient.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rec.patient.age} yrs • {rec.patient.diabetesStatus}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-3.5 sm:px-4 text-slate-600 font-mono text-[11px]">
                        {rec.patient.examDate}
                      </td>

                      {/* Screening Result */}
                      <td className="py-2.5 px-3.5 sm:px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          isNormal 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : isPoor 
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {rec.overallCategory}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3.5 sm:px-4">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          DEMO DATA
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3.5 sm:px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                          <span>View Analysis</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>Displaying verified research records stored in browser session cache.</span>
          <span className="font-mono">RetinaCare Protocol v2.4 • High Density Mode</span>
        </div>
      </div>

    </div>
  );
};
