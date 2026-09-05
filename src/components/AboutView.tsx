import React from 'react';
import { 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  Scale, 
  Layers, 
  CheckCircle2, 
  BookOpen, 
  Cpu,
  GraduationCap
} from 'lucide-react';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

export const AboutView: React.FC = () => {
  return (
    <div id="about-view" className="space-y-8 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>College & Clinical Research Prototype</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            RetinaCare AI
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            An assistive clinical research platform engineered for automated retinal fundus screening, bilateral left-vs-right eye asymmetry detection, and structured triage reporting.
          </p>
        </div>
      </div>

      <MedicalDisclaimerBanner />

      {/* Core Principles */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-cyan-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Medical Terminology & Communication Guardrails
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          RetinaCare AI strictly enforces medical-safety communication standards designed to prevent diagnostic over-reach or patient false-assurance:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-cyan-700 font-bold">1.</span> Screening Category vs Diagnosis
            </div>
            <p className="text-slate-600 leading-relaxed">
              Results are labeled as <strong>AI Screening Category</strong> rather than a confirmed medical diagnosis or diabetes stage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-cyan-700 font-bold">2.</span> Probabilistic Language
            </div>
            <p className="text-slate-600 leading-relaxed">
              Findings are classified using terms like <em>&ldquo;possible signs,&rdquo; &ldquo;potential abnormality,&rdquo;</em> and <em>&ldquo;requires professional evaluation.&rdquo;</em>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-cyan-700 font-bold">3.</span> Quality-Gated Inferences
            </div>
            <p className="text-slate-600 leading-relaxed">
              Images failing automated quality metrics (resolution, blur, glare, coverage) trigger safety guardrails prohibiting confident categorization.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-cyan-700 font-bold">4.</span> Medication Invariance
            </div>
            <p className="text-slate-600 leading-relaxed">
              The application never offers recommendations regarding medication, insulin dosage adjustments, or therapeutic changes.
            </p>
          </div>
        </div>
      </div>

      {/* Bilateral Comparison Methodology */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Scale className="w-5 h-5 text-teal-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Why Bilateral (Left vs Right Eye) Comparison Matters
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Diabetic retinopathy typically manifests symmetrically over long disease durations; however, asymmetric presentations can frequently occur due to localized ischemia, prior pan-retinal photocoagulation, carotid artery occlusive disease, or ocular hypertension.
        </p>

        <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs text-slate-700 space-y-2">
          <p className="font-semibold text-cyan-950">
            RetinaCare AI systematically tabulates:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Comparative microaneurysm candidate density across macula and arcades</li>
            <li>Intra-retinal blot and flame hemorrhage distributions</li>
            <li>Hard exudate clustering relative to the foveal avascular zone (FAZ)</li>
            <li>Vascular caliber variation, focal constriction, and venous beading parity</li>
          </ul>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Cpu className="w-5 h-5 text-indigo-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Technical Architecture & Modular Model Decoupling
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The application follows a decoupled component design where the automated inference pipeline (<code className="font-mono text-cyan-800 bg-cyan-50 px-1 py-0.5 rounded">imageAnalysis.ts</code>) is cleanly abstracted from the presentation layer. This enables seamless substitution of the research prototype feature extractor with hospital-grade CNN/Transformer architectures (e.g. ResNet-50, Vision Transformer, or Gemini multimodal endpoints) without altering the clinical UI.
        </p>
      </div>

    </div>
  );
};
