import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { ScreeningRecord, ScreeningCategory } from '../types';

interface ScreeningStatisticsChartProps {
  records: ScreeningRecord[];
}

type ScopeType = 'overall' | 'left' | 'right';
type DisplayMode = 'categories' | 'binary';

interface CategoryDataPoint {
  category: ScreeningCategory;
  shortName: string;
  fullName: string;
  count: number;
  percentage: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

export const ScreeningStatisticsChart: React.FC<ScreeningStatisticsChartProps> = ({ records }) => {
  const [scope, setScope] = useState<ScopeType>('overall');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('categories');

  // Compute distribution of AI Screening Categories across patient records
  const categoryStats = useMemo(() => {
    const totalRecords = records.length;

    const counts: Record<ScreeningCategory, number> = {
      'No obvious abnormality detected': 0,
      'Possible mild retinal abnormalities': 0,
      'Possible moderate retinal abnormalities': 0,
      'Possible severe retinal abnormalities': 0,
      'Unable to assess reliably': 0
    };

    records.forEach(rec => {
      let cat: ScreeningCategory;
      if (scope === 'left') {
        cat = rec.leftEye?.screeningCategory || rec.overallCategory;
      } else if (scope === 'right') {
        cat = rec.rightEye?.screeningCategory || rec.overallCategory;
      } else {
        cat = rec.overallCategory;
      }

      if (counts[cat] !== undefined) {
        counts[cat]++;
      } else {
        counts['No obvious abnormality detected']++;
      }
    });

    const categoriesData: CategoryDataPoint[] = [
      {
        category: 'No obvious abnormality detected',
        shortName: 'Normal',
        fullName: 'No Obvious Abnormality Detected',
        count: counts['No obvious abnormality detected'],
        percentage: totalRecords ? Math.round((counts['No obvious abnormality detected'] / totalRecords) * 100) : 0,
        color: '#0d9488', // Teal-600
        badgeBg: 'bg-teal-50',
        badgeBorder: 'border-teal-200',
        badgeText: 'text-teal-800',
        description: 'Vascular and macular architecture within normal physiological limits'
      },
      {
        category: 'Possible mild retinal abnormalities',
        shortName: 'Mild',
        fullName: 'Possible Mild Retinal Abnormalities',
        count: counts['Possible mild retinal abnormalities'],
        percentage: totalRecords ? Math.round((counts['Possible mild retinal abnormalities'] / totalRecords) * 100) : 0,
        color: '#eab308', // Yellow-500
        badgeBg: 'bg-amber-50',
        badgeBorder: 'border-amber-200',
        badgeText: 'text-amber-800',
        description: 'Isolated microaneurysms or subtle dot hemorrhages'
      },
      {
        category: 'Possible moderate retinal abnormalities',
        shortName: 'Moderate',
        fullName: 'Possible Moderate Retinal Abnormalities',
        count: counts['Possible moderate retinal abnormalities'],
        percentage: totalRecords ? Math.round((counts['Possible moderate retinal abnormalities'] / totalRecords) * 100) : 0,
        color: '#f97316', // Orange-500
        badgeBg: 'bg-orange-50',
        badgeBorder: 'border-orange-200',
        badgeText: 'text-orange-800',
        description: 'Multiple blot hemorrhages, hard lipid exudates, or vessel changes'
      },
      {
        category: 'Possible severe retinal abnormalities',
        shortName: 'Severe',
        fullName: 'Possible Severe Retinal Abnormalities',
        count: counts['Possible severe retinal abnormalities'],
        percentage: totalRecords ? Math.round((counts['Possible severe retinal abnormalities'] / totalRecords) * 100) : 0,
        color: '#e11d48', // Rose-600
        badgeBg: 'bg-rose-50',
        badgeBorder: 'border-rose-200',
        badgeText: 'text-rose-800',
        description: 'High-density retinal lesions, venous beading, urgent triage'
      },
      {
        category: 'Unable to assess reliably',
        shortName: 'Inconclusive',
        fullName: 'Unable to Assess Reliably (Poor Quality)',
        count: counts['Unable to assess reliably'],
        percentage: totalRecords ? Math.round((counts['Unable to assess reliably'] / totalRecords) * 100) : 0,
        color: '#64748b', // Slate-500
        badgeBg: 'bg-slate-100',
        badgeBorder: 'border-slate-300',
        badgeText: 'text-slate-700',
        description: 'Sub-optimal illumination, media opacity, or severe blur'
      }
    ];

    const totalAbnormal = 
      counts['Possible mild retinal abnormalities'] +
      counts['Possible moderate retinal abnormalities'] +
      counts['Possible severe retinal abnormalities'];

    const binaryData = [
      {
        name: 'Normal',
        fullName: 'No Obvious Abnormality',
        count: counts['No obvious abnormality detected'],
        percentage: totalRecords ? Math.round((counts['No obvious abnormality detected'] / totalRecords) * 100) : 0,
        color: '#0d9488',
        badgeBg: 'bg-teal-50',
        badgeBorder: 'border-teal-200',
        badgeText: 'text-teal-800',
        description: 'Screening shows no diagnostic signs of diabetic retinopathy'
      },
      {
        name: 'Abnormal Findings',
        fullName: 'Suspected Retinal Abnormalities',
        count: totalAbnormal,
        percentage: totalRecords ? Math.round((totalAbnormal / totalRecords) * 100) : 0,
        color: '#e11d48',
        badgeBg: 'bg-rose-50',
        badgeBorder: 'border-rose-200',
        badgeText: 'text-rose-800',
        description: 'Contains mild, moderate, or severe retinal microvascular findings'
      },
      {
        name: 'Inconclusive / Retest',
        fullName: 'Unable to Assess Reliably',
        count: counts['Unable to assess reliably'],
        percentage: totalRecords ? Math.round((counts['Unable to assess reliably'] / totalRecords) * 100) : 0,
        color: '#64748b',
        badgeBg: 'bg-slate-100',
        badgeBorder: 'border-slate-300',
        badgeText: 'text-slate-700',
        description: 'Inadequate clarity for reliable AI assessment; retest recommended'
      }
    ];

    return {
      totalRecords,
      categoriesData,
      binaryData,
      totalAbnormal,
      abnormalRate: totalRecords ? Math.round((totalAbnormal / totalRecords) * 100) : 0,
      normalRate: totalRecords ? Math.round((counts['No obvious abnormality detected'] / totalRecords) * 100) : 0
    };
  }, [records, scope]);

  // Active chart dataset based on display mode
  const activeChartData = displayMode === 'categories' ? categoryStats.categoriesData : categoryStats.binaryData;

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs max-w-xs z-50 backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-slate-100 text-xs">{item.fullName}</span>
            <span 
              className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
              style={{ backgroundColor: `${item.color}25`, color: item.color }}
            >
              {item.count} {item.count === 1 ? 'record' : 'records'} ({item.percentage}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            {item.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="ai-screening-category-statistics-card" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Top Header & Interactive Filters */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              AI Screening Category Distribution
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {categoryStats.totalRecords} {categoryStats.totalRecords === 1 ? 'Patient Record' : 'Patient Records'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 ml-8">
            Statistical distribution of automated AI screening category classifications across all evaluated patients
          </p>
        </div>

        {/* View Mode & Scope Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          
          {/* Eye Scope selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600">
            <button
              type="button"
              id="scope-overall-btn"
              onClick={() => setScope('overall')}
              className={`px-2 py-1 rounded-md transition-all ${
                scope === 'overall' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Overall Patient
            </button>
            <button
              type="button"
              id="scope-left-btn"
              onClick={() => setScope('left')}
              className={`px-2 py-1 rounded-md transition-all ${
                scope === 'left' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Left (OS)
            </button>
            <button
              type="button"
              id="scope-right-btn"
              onClick={() => setScope('right')}
              className={`px-2 py-1 rounded-md transition-all ${
                scope === 'right' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Right (OD)
            </button>
          </div>

          {/* Detailed Categories vs Normal/Abnormal overview */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600">
            <button
              type="button"
              id="mode-categories-btn"
              onClick={() => setDisplayMode('categories')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                displayMode === 'categories' ? 'bg-white text-teal-800 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All 5 AI Categories
            </button>
            <button
              type="button"
              id="mode-binary-btn"
              onClick={() => setDisplayMode('binary')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                displayMode === 'binary' ? 'bg-white text-teal-800 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Normal vs Abnormal
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 sm:p-4">
        {categoryStats.totalRecords === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Info className="w-8 h-8 text-slate-300" />
            <span>No patient records available yet. Start a new screening to visualize category distributions.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* Recharts Bar Chart Container (8 cols on desktop) */}
            <div className="lg:col-span-8">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activeChartData}
                    margin={{ top: 22, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey={displayMode === 'categories' ? 'shortName' : 'name'} 
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar 
                      dataKey="count" 
                      radius={[6, 6, 0, 0]}
                      maxBarSize={58}
                    >
                      <LabelList 
                        dataKey="count" 
                        position="top" 
                        fill="#475569" 
                        fontSize={11} 
                        fontWeight={700} 
                        offset={6}
                      />
                      {activeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Legend & Explanation */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 gap-2">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  <span>Showing distribution for <strong>{scope === 'overall' ? 'Overall Patient Classification' : scope === 'left' ? 'Left Eye (OS)' : 'Right Eye (OD)'}</strong></span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Total Cohort: {categoryStats.totalRecords} records
                </span>
              </div>
            </div>

            {/* Sidebar Summary & Breakdown List (4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between mb-0.5">
                <span>AI Category Breakdown</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">
                  {displayMode === 'categories' ? '5 Categories' : 'Binary Grouping'}
                </span>
              </div>

              {displayMode === 'categories' ? (
                <div className="space-y-1.5">
                  {categoryStats.categoriesData.map(item => (
                    <div 
                      key={item.category} 
                      className={`p-2 rounded-lg border ${item.badgeBorder} ${item.badgeBg} flex items-center justify-between transition-colors`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-900 truncate">
                            {item.shortName}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.fullName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-900">
                          {item.count}
                        </div>
                        <div className={`text-[10px] font-bold ${item.badgeText}`}>
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {categoryStats.binaryData.map(item => (
                    <div 
                      key={item.name} 
                      className={`p-2 rounded-lg border ${item.badgeBorder} ${item.badgeBg} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-900">
                          {item.count}
                        </div>
                        <div className={`text-[10px] font-bold ${item.badgeText}`}>
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Clinical Referral Rate Alert */}
              <div className="mt-1 p-2 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{categoryStats.abnormalRate}%</strong> of patient records ({categoryStats.totalAbnormal} cases) require clinical referral or ophthalmologist evaluation.
                </span>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};
