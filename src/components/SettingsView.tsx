import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  User,
  Building,
  FileText,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AppSettings, saveAppSettings, resetToSeedReports, saveReports } from '../utils/storage';
import { AnalysisReport } from '../types/telaah';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  reports: AnalysisReport[];
  onReloadReports: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  reports,
  onReloadReports,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [resetToast, setResetToast] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(formData);
    onUpdateSettings(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleExportAll = () => {
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reports, null, 2))}`;
    const a = document.createElement('a');
    a.href = jsonStr;
    a.download = `backup_telaah_rpp_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          saveReports(parsed);
          onReloadReports();
          alert(`Berhasil mengimpor ${parsed.length} riwayat telaah RPP.`);
        } else {
          alert('Format berkas cadangan JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSeed = () => {
    if (confirm('Apakah Anda ingin memulihkan 3 data contoh RPP awal (SD, SMP, SMA)? Data riwayat saat ini akan diperbarui.')) {
      resetToSeedReports();
      onReloadReports();
      setResetToast(true);
      setTimeout(() => setResetToast(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          PENGATURAN APLIKASI TELAAH RPP
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Atur profil default penelaah kurikulum dan kelola pencadangan data
        </p>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Pengaturan berhasil disimpan!
        </div>
      )}

      {resetToast && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-sky-600" />
          Data contoh awal (SD, SMP, SMA) berhasil dimuat kembali!
        </div>
      )}

      {/* Profil Penelaah Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Profil Default Penelaah / Asesor
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Nama Lengkap &amp; Gelar Penelaah
            </label>
            <input
              type="text"
              value={formData.defaultReviewerName}
              onChange={(e) => setFormData({ ...formData, defaultReviewerName: e.target.value })}
              placeholder="Contoh: Dr. H. Muhammad Arifin, M.Pd."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              NIP / NUPTK Penelaah
            </label>
            <input
              type="text"
              value={formData.defaultReviewerNip}
              onChange={(e) => setFormData({ ...formData, defaultReviewerNip: e.target.value })}
              placeholder="Contoh: 19750812 200003 1 004"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">
              Instansi / Jabatan Pengawas
            </label>
            <input
              type="text"
              value={formData.defaultInstitution}
              onChange={(e) => setFormData({ ...formData, defaultInstitution: e.target.value })}
              placeholder="Contoh: Dinas Pendidikan & Kebudayaan / Pengawas Sekolah Wilayah I"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Simpan Profil Penelaah
          </button>
        </div>
      </form>

      {/* Cadangan & Pemulihan Data */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          Cadangan &amp; Pemulihan Data Telaah
        </h2>
        <p className="text-xs text-slate-500">
          Ekspor semua riwayat telaah yang tersimpan ke format JSON atau pulihkan data dari cadangan sebelumnya.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportAll}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-colors space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <Download className="w-4 h-4 text-emerald-600" />
              Ekspor Cadangan (JSON)
            </div>
            <p className="text-[11px] text-slate-500">
              Unduh seluruh {reports.length} naskah hasil telaah
            </p>
          </button>

          <label className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-left transition-colors cursor-pointer space-y-1 block">
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <Upload className="w-4 h-4 text-teal-600" />
              Impor Cadangan (JSON)
            </div>
            <p className="text-[11px] text-slate-500">
              Muat riwayat dari file JSON lokal
            </p>
          </label>

          <button
            type="button"
            onClick={handleResetToSeed}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-left transition-colors space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <RotateCcw className="w-4 h-4 text-sky-600" />
              Muat Ulang Contoh RPP
            </div>
            <p className="text-[11px] text-slate-500">
              Reset ke 3 contoh RPP awal
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
