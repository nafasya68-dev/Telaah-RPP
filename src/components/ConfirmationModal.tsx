import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isDoubleWarning?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isDestructive = true,
  isDoubleWarning = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className={`p-5 flex items-start gap-4 ${isDoubleWarning ? 'bg-rose-50 border-b border-rose-200' : 'bg-amber-50/50 border-b border-amber-200/50'}`}>
          <div className={`p-2.5 rounded-xl ${isDoubleWarning ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className={`text-lg font-bold ${isDoubleWarning ? 'text-rose-900' : 'text-slate-900'}`}>
              {title}
            </h3>
            {isDoubleWarning && (
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded bg-rose-200 text-rose-800 uppercase tracking-wide">
                Tindakan Tidak Dapat Dibatalkan
              </span>
            )}
          </div>
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-slate-300"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all focus:ring-2 flex items-center gap-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
