import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ScreeningRecord } from '../types';

interface HbA1cTrendChartProps {
  records: ScreeningRecord[];
  onSelectRecord?: (record: ScreeningRecord) => void;
}

// Helper to reliably parse HbA1c string values into a clean number
export function parseHbA1c(val?: string | number): number | null {
  if (val === undefined || val === null) return null;
  const cleaned = String(val).replace(/%/g, '').trim();
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 2.0 || parsed > 25.0) return null;
  return Math.round(parsed * 10) / 10;
}

interface TrendPoint {
  index: number;
  label: string;
  screeningNumber: string;
  date: string;
  patientName: string;
  patientId: string;
  diabetesType: string;
  hba1c: number;
  averageHbA1c: number;
  retinopathyCategory: string;
  record: ScreeningRecord;
}

export const HbA1cTrendChart: React.FC<HbA1cTrendChartProps> = ({ records, onSelectRecord }) => {
  const [metricView, setMetricView] = useState<'both' | 'average' | 'patient'>('both');

  // Extract and sort all records that have valid HbA1c values chronologically
  const sortedRecordsWithHbA1c = useMemo(() => {
    return records
      .map(rec => ({
        record: rec,
        hba1c: parseHbA1c(rec.patient.hba1c),
        date: rec.patient.examDate || (rec.timestamp ? rec.timestamp.split('T')[0] : '')
      }))
      .filter((item): item is { record: ScreeningRecord; hba1c: number; date: string } => item.hba1c !== null)
      .sort((a, b) => {
        const timeA = new Date(a.date || a.record.timestamp).getTime();
        const timeB = new Date(b.date || b.record.timestamp).getTime();
        return timeA - timeB;
      });
  }, [records]);

  // Take the last 5 screenings for longitudinal historical trend analysis
  const last5Screenings = useMemo(() => {
    return sortedRecordsWithHbA1c.slice(-5);
  }, [sortedRecordsWithHbA1c]);

  // Compute trend points with rolling/cohort average HbA1c
  const trendData: TrendPoint[] = useMemo(() => {
    if (last5Screenings.length === 0) return [];

    let runningSum = 0;

    return last5Screenings.map((item, idx) => {
      runningSum += item.hba1c;
      const runningAvg = Math.round((runningSum / (idx + 1)) * 10) / 10;

      // Format clean short date (e.g., "Aug 12" or "08/12")
      let dateLabel = item.date;
      try {
        const d = new Date(item.date + 'T12:00:00');
        if (!isNaN(d.getTime())) {
          dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
      } catch {
        dateLabel = item.date;
      }

      return {
        index: idx + 1,
        label: `Screening ${idx + 1}`,
        screeningNumber: `#${idx + 1}`,
        date: dateLabel,
        patientName: item.record.patient.name,
        patientId: item.record.patient.patientNumber,
        diabetesType: item.record.patient.diabetesStatus,
        hba1c: item.hba1c,
        averageHbA1c: runningAvg,
        retinopathyCategory: item.record.overallCategory,
        record: item.record
      };
    });
  }, [last5Screenings]);

  // Calculate high-level summary KPIs for these last 5 screenings
  const summaryKPIs = useMemo(() => {
    if (trendData.length === 0) {
      return {
        currentAverage: 0,
        trendDelta: 0,
        atTargetCount: 0,
        atTargetPercent: 0,
        minHbA1c: 0,
        maxHbA1c: 0,
        count: 0
      };
    }

    const count = trendData.length;
    const values = trendData.map(d => d.hba1c);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const currentAverage = Math.round((sum / count) * 10) / 10;

    // Trend delta from 1st of the 5 to the 5th
    const firstVal = trendData[0].averageHbA1c;
    const lastVal = trendData[trendData.length - 1].averageHbA1c;
    const trendDelta = Math.round((lastVal - firstVal) * 10) / 10;

    // Patients with HbA1c <= 7.0% (American Diabetes Association recommended general target)
    const atTargetCount = values.filter(v => v <= 7.0).length;
    const atTargetPercent = Math.round((atTargetCount / count) * 100);

    const minHbA1c = Math.min(...values);
    const maxHbA1c = Math.max(...values);

    return {
      currentAverage,
      trendDelta,
      atTargetCount,
      atTargetPercent,
      minHbA1c,
      maxHbA1c,
      count
    };
  }, [trendData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const point: TrendPoint = payload[0].payload;
      const isTarget = point.hba1c <= 7.0;
      const isHigh = point.hba1c >= 8.0;

      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs max-w-xs z-50 backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-slate-800">
            <div>
              <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                <span>{point.patientName}</span>
                <span className="font-mono text-[10px] text-teal-400">({point.patientId})</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Screening #{point.index} • {point.date}
              </div>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
              isTarget 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : isHigh 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {point.hba1c}% HbA1c
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Running Cohort Average:</span>
              <span className="font-semibold text-teal-300 font-mono">{point.averageHbA1c}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Diabetes Status:</span>
              <span className="text-slate-200">{point.diabetesType}</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-800 flex items-start gap-1">
              <span className="font-semibold text-slate-300">Eye Screening:</span>
              <span className="text-slate-200 italic truncate">{point.retinopathyCategory}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="hba1c-trend-statistics-card" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              Average HbA1c Longitudinal Trends (Last 5 Screenings)
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {summaryKPIs.count} Data Points
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 ml-8">
            Tracking glycemic control patterns and correlation with retinal microvascular health across recent encounters
          </p>
        </div>

        {/* View mode toggle buttons */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            id="hba1c-view-both-btn"
            onClick={() => setMetricView('both')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
              metricView === 'both'
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Average & Patients
          </button>
          <button
            type="button"
            id="hba1c-view-avg-btn"
            onClick={() => setMetricView('average')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
              metricView === 'average'
                ? 'bg-white text-teal-800 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cohort Average Line
          </button>
          <button
            type="button"
            id="hba1c-view-patient-btn"
            onClick={() => setMetricView('patient')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
              metricView === 'patient'
                ? 'bg-white text-indigo-800 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Screening Points
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 sm:p-4">
        {trendData.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Info className="w-8 h-8 text-slate-300" />
            <span>No HbA1c data recorded yet across patient profiles. Enter HbA1c in patient details to view trends.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* Line Chart Area (8 cols on desktop) */}
            <div className="lg:col-span-8">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 25, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    
                    {/* Glycemic Reference Target Thresholds */}
                    <ReferenceLine 
                      y={7.0} 
                      stroke="#ef4444" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ 
                        value: 'ADA Target ≤ 7.0%', 
                        position: 'right', 
                        fill: '#ef4444', 
                        fontSize: 10, 
                        fontWeight: 600 
                      }} 
                    />
                    
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[5.5, 9.5]}
                      ticks={[6.0, 7.0, 8.0, 9.0]}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Line 1: Average HbA1c Trend */}
                    {(metricView === 'both' || metricView === 'average') && (
                      <Line
                        type="monotone"
                        dataKey="averageHbA1c"
                        name="Average HbA1c"
                        stroke="#0d9488" // Teal-600
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    )}

                    {/* Line 2: Specific Patient Encounter HbA1c */}
                    {(metricView === 'both' || metricView === 'patient') && (
                      <Line
                        type="linear"
                        dataKey="hba1c"
                        name="Screening HbA1c"
                        stroke="#6366f1" // Indigo-500
                        strokeWidth={1.75}
                        strokeDasharray={metricView === 'both' ? '4 4' : undefined}
                        dot={{ r: 4, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 1.5 }}
                        activeDot={{ r: 6, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Legend & Explanation */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  {(metricView === 'both' || metricView === 'average') && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-teal-600 rounded-full"></span>
                      <span className="font-semibold text-slate-700">Cohort Average HbA1c</span>
                    </div>
                  )}
                  {(metricView === 'both' || metricView === 'patient') && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-indigo-500 rounded-full border border-dashed"></span>
                      <span className="font-medium text-slate-600">Individual Screening Value</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-rose-500"></span>
                    <span className="text-[10px] text-rose-700 font-medium">ADA Limit (7.0%)</span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  Chronological order (oldest → newest)
                </span>
              </div>
            </div>

            {/* Sidebar Summary KPIs (4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Glycemic Health Summary</span>
                <span className="text-[11px] font-mono text-slate-500 font-normal">
                  Last 5 Encounters
                </span>
              </div>

              {/* Current Average Card */}
              <div className="p-3 rounded-lg border border-teal-100 bg-teal-50/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                    Average Cohort HbA1c
                  </div>
                  <div className="text-xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
                    <span>{summaryKPIs.currentAverage}%</span>
                    <span className="text-[11px] text-slate-500 font-normal">mean</span>
                  </div>
                </div>
                
                {/* Trend Delta indicator */}
                <div className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                  summaryKPIs.trendDelta < 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : summaryKPIs.trendDelta > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                }`}>
                  {summaryKPIs.trendDelta < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : summaryKPIs.trendDelta > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {summaryKPIs.trendDelta > 0 ? `+${summaryKPIs.trendDelta}%` : `${summaryKPIs.trendDelta}%`}
                  </span>
                </div>
              </div>

              {/* Glycemic Target Adherence Card */}
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-teal-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">ADA Target Adherence</div>
                    <div className="text-[10px] text-slate-500">HbA1c ≤ 7.0% threshold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{summaryKPIs.atTargetPercent}%</div>
                  <div className="text-[10px] text-teal-700 font-bold">{summaryKPIs.atTargetCount} of {summaryKPIs.count}</div>
                </div>
              </div>

              {/* Historical Range Card */}
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Range (Min — Max)</div>
                    <div className="text-[10px] text-slate-500">Recorded glycemic span</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-slate-900">
                    {summaryKPIs.minHbA1c}% — {summaryKPIs.maxHbA1c}%
                  </div>
                  <div className="text-[10px] text-slate-500">Spread: {Math.round((summaryKPIs.maxHbA1c - summaryKPIs.minHbA1c) * 10) / 10}%</div>
                </div>
              </div>

              {/* Clinical Retinopathy Correlation Insight */}
              <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-snug flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Clinical Correlation:</strong> Sustained HbA1c levels &gt; 7.0% increase the relative risk of microaneurysms and diabetic macular edema progression by up to 2.4x.
                </span>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};
