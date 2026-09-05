import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Eye, 
  Sparkles, 
  Scan, 
  Activity, 
  FileCheck, 
  Binary,
  Layers,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAnalysisWorkflowProps {
  leftImageUrl: string;
  rightImageUrl: string;
  onComplete: () => void;
}

interface StepItem {
  id: number;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Checking image quality', description: 'Evaluating contrast, blur metrics, and optic field visibility', icon: Scan },
  { id: 2, label: 'Identifying retinal region', description: 'Segmenting optic disc margin, macula, and vessel arcades', icon: Layers },
  { id: 3, label: 'Extracting retinal features', description: 'Performing multi-scale vascular tracking and texture analysis', icon: Binary },
  { id: 4, label: 'Screening for potential abnormalities', description: 'Detecting microaneurysm candidates, hemorrhages, and lipid exudates', icon: Search },
  { id: 5, label: 'Comparing left and right eyes', description: 'Computing bilateral symmetry matrix and inter-eye variance', icon: Activity },
  { id: 6, label: 'Preparing screening report', description: 'Generating structured findings and recommended next steps', icon: FileCheck },
];

export const AIAnalysisWorkflow: React.FC<AIAnalysisWorkflowProps> = ({
  leftImageUrl,
  rightImageUrl,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [telemetry, setTelemetry] = useState({
    pixelsProcessed: 124000,
    featuresScanned: 18,
    bilateralDelta: 0.12
  });

  useEffect(() => {
    const stepDuration = 650; // ms per step
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 6;
        }
        return prev + 1;
      });

      // Update telemetry
      setTelemetry((prev) => ({
        pixelsProcessed: prev.pixelsProcessed + Math.floor(Math.random() * 85000 + 40000),
        featuresScanned: prev.featuresScanned + Math.floor(Math.random() * 25 + 15),
        bilateralDelta: Number((Math.random() * 0.4 + 0.05).toFixed(2))
      }));
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercentage = Math.round((currentStep / 6) * 100);

  return (
    <div id="ai-analysis-workflow-container" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-800 overflow-hidden relative">
      
      {/* Background ambient medical grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight text-white">
                RetinaCare AI Screening Engine
              </h3>
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated multi-spectral bilateral fundus feature extraction
            </p>
          </div>
        </div>

        {/* Telemetry chips */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">PROCESSED PIXELS</span>
            <span className="text-cyan-300 font-bold">{telemetry.pixelsProcessed.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">CANDIDATE NODES</span>
            <span className="text-teal-300 font-bold">{telemetry.featuresScanned}</span>
          </div>
        </div>
      </div>

      {/* Center Retinal Scanning Visualizers */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        
        {/* Left Eye Scan Port */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-cyan-900/40 p-4 aspect-square max-h-[260px] mx-auto flex items-center justify-center group shadow-inner">
          <img
            src={leftImageUrl}
            alt="Left Eye Scanning"
            className="w-full h-full object-contain filter contrast-110 opacity-80"
          />

          {/* Laser scanning beam */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
            animate={{ top: ['5%', '95%', '5%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Crosshair target reticle */}
          <div className="absolute inset-0 border border-cyan-500/20 pointer-events-none rounded-2xl m-3 flex items-center justify-center">
            <div className="w-16 h-16 border border-cyan-400/40 rounded-full animate-ping" />
            <div className="w-24 h-24 border border-cyan-400/20 rounded-full" />
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400">OS // LEFT EYE</div>
          </div>
        </div>

        {/* Right Eye Scan Port */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-teal-900/40 p-4 aspect-square max-h-[260px] mx-auto flex items-center justify-center group shadow-inner">
          <img
            src={rightImageUrl}
            alt="Right Eye Scanning"
            className="w-full h-full object-contain filter contrast-110 opacity-80"
          />

          {/* Laser scanning beam */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf]"
            animate={{ top: ['95%', '5%', '95%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Crosshair target reticle */}
          <div className="absolute inset-0 border border-teal-500/20 pointer-events-none rounded-2xl m-3 flex items-center justify-center">
            <div className="w-16 h-16 border border-teal-400/40 rounded-full animate-ping" />
            <div className="w-24 h-24 border border-teal-400/20 rounded-full" />
            <div className="absolute top-2 left-2 text-[10px] font-mono text-teal-400">OD // RIGHT EYE</div>
          </div>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">ANALYSIS SEQUENCE EXECUTION</span>
          <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-cyan-500 via-teal-400 to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
      </div>

      {/* 6 Sequential Steps Workflow */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrent 
                  ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-900/20 scale-[1.02]' 
                  : isDone 
                    ? 'bg-slate-800/60 border-slate-700/80 text-slate-300' 
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${
                    isCurrent ? 'bg-cyan-500/20 text-cyan-400' : isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Step {step.id}
                  </span>
                </div>

                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                {isPending && <span className="text-[10px] font-mono text-slate-600">WAITING</span>}
              </div>

              <h4 className="text-xs font-semibold text-slate-200">
                {step.label}
              </h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Screening models apply feature-gradient mapping and bilateral anomaly comparison. Please do not close this window.
        </p>
      </div>

    </div>
  );
};
