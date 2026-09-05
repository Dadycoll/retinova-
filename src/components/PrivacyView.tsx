import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Database, 
  EyeOff, 
  FileCheck,
  HardDrive
} from 'lucide-react';

interface PrivacyViewProps {
  onClearAllData: () => void;
  recordCount: number;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
  onClearAllData,
  recordCount
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    onClearAllData();
    setConfirmOpen(false);
    setSuccessMessage('All local patient records and cached retinal images have been purged from your browser.');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div id="privacy-view" className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Data & Privacy
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent data architecture, memory boundaries, and clinical data governance disclosure
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Primary Privacy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Local Processing Guarantee */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <EyeOff className="w-4 h-4 text-cyan-600" />
            <span>Zero Public Exposure</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Patient identifiers (Names, IDs, Demographics) and uploaded retinal image scans are processed strictly within your authenticated client session. No patient data or ocular scans are broadcast to public endpoints or third-party advertising trackers.
          </p>
        </div>

        {/* Association Integrity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <Database className="w-4 h-4 text-teal-600" />
            <span>Encrypted Session Association</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Left eye (OS) and Right eye (OD) fundus captures are strictly bounded to the specific patient record identifier. Cross-contamination between distinct screening encounters is prevented through discrete record hashing.
          </p>
        </div>

        {/* Temporary vs Persistent Storage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>Storage & Retention Disclosure</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Screening records in this deployment are cached locally in your browser&apos;s secured sandbox storage for session continuity. They do not automatically persist to an unmonitored permanent cloud repository.
          </p>
        </div>

        {/* Compliance Transparency */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>Regulatory & Compliance Transparency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            RetinaCare AI is developed as a <em>college/clinical research prototype</em>. We deliberately refrain from making unsubstantiated claims of HIPAA or GDPR certification until full enterprise institutional business associate agreements (BAAs) and hardware security modules (HSMs) are formally audited.
          </p>
        </div>

      </div>

      {/* Section: Delete Patient Data */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">
                Delete Patient Data
              </h3>
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              Permanently delete all patient screening records, health histories, and cached retinal scans currently stored in this workstation&apos;s browser memory ({recordCount} records loaded).
            </p>
          </div>

          <button
            type="button"
            id="open-delete-data-modal-btn"
            onClick={() => setConfirmOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold transition-colors self-start sm:self-auto shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete Patient Data</span>
          </button>
        </div>

        {/* Confirmation modal / box */}
        {confirmOpen && (
          <div className="mt-5 pt-5 border-t border-rose-200 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-rose-900 text-sm block">Confirm Irreversible Data Purge</strong>
                  This action will permanently delete all {recordCount} patient screening records, including all uploaded left/right fundus images and screening reports. This action cannot be undone.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-delete-all-data-btn"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Yes, Delete All Patient Records
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
