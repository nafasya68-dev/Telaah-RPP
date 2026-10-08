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
  Trash2,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  Bot,
  Cpu,
  Zap,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import {
  AppSettings,
  DEFAULT_AI_CONFIG,
  saveAppSettings,
  saveReports,
  purgeAllDemoData,
  clearAllLocalData,
  getStorageUsageSummary,
} from '../utils/storage';
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
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    aiConfig: {
      ...DEFAULT_AI_CONFIG,
      ...(settings.aiConfig || {}),
    },
  });
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isTestingAi, setIsTestingAi] = useState<boolean>(false);
  const [aiTestResult, setAiTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const testAiConnection = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const startTime = Date.now();
      const res = await fetch('/api/health');
      const data = await res.json();
      const latency = Date.now() - startTime;
      if (res.ok && data.status === 'ok') {
        setAiTestResult({
          ok: true,
          message: `Koneksi AI Gemini Normal! Latensi: ${latency}ms | Model Siap: ${formData.aiConfig.model}`,
        });
      } else {
        setAiTestResult({
          ok: false,
          message: 'Server merespons tetapi status tidak siap.',
        });
      }
    } catch (e: any) {
      setAiTestResult({
        ok: false,
        message: 'Gagal terhubung ke endpoint AI server: ' + (e.message || 'Network error'),
      });
    } finally {
      setIsTestingAi(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

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
    showToast('Berkas cadangan JSON berhasil diunduh ke perangkat Anda.');
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
          showToast(`Berhasil memuat ${parsed.length} riwayat telaah RPP dari berkas cadangan.`);
        } else {
          alert('Format berkas cadangan JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handlePurgeDemo = () => {
    if (confirm('Hapus seluruh data demo / contoh awal dari penyimpanan lokal perangkat ini?')) {
      const res = purgeAllDemoData();
      onReloadReports();
      showToast(
        res.purgedCount > 0
          ? `Berhasil membersihkan ${res.purgedCount} data demo. Menyisakan ${res.remainingReports.length} dokumen asli.`
          : 'Semua data demo sudah bersih dari perangkat Anda.'
      );
    }
  };

  const handleClearAllStorage = () => {
    if (
      confirm(
        'PERINGATAN: Apakah Anda yakin ingin mengosongkan SELURUH riwayat telaah di perangkat ini? Tindakan ini tidak dapat dibatalkan kecuali Anda telah mengunduh berkas cadangan JSON.'
      )
    ) {
      clearAllLocalData();
      onReloadReports();
      showToast('Seluruh data di Local Storage perangkat ini telah berhasil dikosongkan.');
    }
  };

  const storageSummary = getStorageUsageSummary();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          PENGATURAN APLIKASI &amp; PENYIMPANAN
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola profil penelaah, penyimpanan lokal di perangkat masing-masing, dan pencadangan data
        </p>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Profil penelaah berhasil disimpan!
        </div>
      )}

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-sky-600" />
          {toastMessage}
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

        {/* Konfigurasi Mesin AI (Google Gemini) */}
        <div className="pt-5 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Konfigurasi Mesin Telaah Otomatis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengaturan model Google Gemini dan parameter telaah 22 indikator
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={testAiConnection}
                disabled={isTestingAi}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Zap className={`w-3.5 h-3.5 ${isTestingAi ? 'animate-spin text-amber-500' : 'text-emerald-600'}`} />
                {isTestingAi ? 'Menguji...' : 'Uji Koneksi AI'}
              </button>

              <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.aiConfig.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiConfig: { ...formData.aiConfig, enabled: e.target.checked },
                    })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-slate-800">
                  {formData.aiConfig.enabled ? 'AI Aktif' : 'AI Nonaktif'}
                </span>
              </label>
            </div>
          </div>

          {aiTestResult && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                aiTestResult.ok
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {aiTestResult.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{aiTestResult.message}</span>
            </div>
          )}

          {formData.aiConfig.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Model AI Utama
                </label>
                <select
                  value={formData.aiConfig.model}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiConfig: {
                        ...formData.aiConfig,
                        model: e.target.value as 'gemini-3.8-flash' | 'gemini-flash-latest',
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Direkomendasikan - Cepat &amp; Akurat)</option>
                  <option value="gemini-flash-latest">Google Gemini Flash Latest (Versi Terbaru)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Model multimodal canggih untuk membaca dan mengevaluasi naskah dokumen PDF/DOCX.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tingkat Ketelitian Asesmen (Strictness)
                </label>
                <select
                  value={formData.aiConfig.strictness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiConfig: {
                        ...formData.aiConfig,
                        strictness: e.target.value as 'standar' | 'ketat' | 'pembinaan',
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="standar">Standar Kurikulum Nasional (Objektif &amp; Berimbang)</option>
                  <option value="ketat">Ketat &amp; Standar Asesor Tinggi (Analisis Kritis Mendalam)</option>
                  <option value="pembinaan">Fasilitatif &amp; Pembinaan Guru (Suportif &amp; Bertahap)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mengatur ketajaman penilaian dan gaya kritik pedagogis dari AI.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Fokus Pedagogis Telaah
                </label>
                <select
                  value={formData.aiConfig.focus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiConfig: {
                        ...formData.aiConfig,
                        focus: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="seimbang">Seimbang (Menyeluruh pada seluruh 22 Indikator)</option>
                  <option value="diferensiasi">Kesiapan &amp; Pembelajaran Berdiferensiasi (Indikator 2 &amp; 17)</option>
                  <option value="kktp_keselarasan">Keselarasan Tujuan, Langkah &amp; Rubrik KKTP (Indikator 5, 6, 21)</option>
                  <option value="deep_learning">3 Pilar Deep Learning (Memahami, Mengaplikasi, Merefleksi)</option>
                  <option value="dimensi_profil">Integrasi Dimensi Profil Lulusan (Indikator 4 &amp; 5)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Memberikan arahan khusus bagi AI saat menelaah komponen prioritas.
                </p>
              </div>

              <div className="flex flex-col justify-center">
                <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={formData.aiConfig.extractQuotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aiConfig: {
                          ...formData.aiConfig,
                          extractQuotes: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="font-bold text-slate-800">
                    Wajib Kutip Bukti Kalimat Autentik dari RPP
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 mt-1 pl-6">
                  AI akan menyalin kutipan kalimat langsung dari naskah sebagai bukti evaluasi setiap indikator.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Simpan Konfigurasi &amp; Profil
          </button>
        </div>
      </form>

      {/* Status Penyimpanan Data di Device / Local Storage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              Penyimpanan Data di Perangkat (Local Storage)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Data disimpan secara aman dan privat di browser perangkat Anda sendiri
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Offline &amp; Privat di Perangkat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-2">
          <p>
            <strong>Prinsip Keamanan Data:</strong> Seluruh berkas RPP yang Anda telaah, nilai 22 indikator, catatan telaah, nama guru, NIP, dan berita acara supervisi disimpan langsung di <strong>Local Storage</strong> perangkat komputer/ponsel Anda.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-600 font-medium border-t border-slate-200/60">
            <span>• Dokumen Aktif: <strong>{reports.length} naskah</strong></span>
            <span>• Tempat Sampah: <strong>{storageSummary.recycleCount} naskah</strong></span>
            <span>• Perkiraan Ukuran: <strong>{storageSummary.estimatedKb} KB</strong></span>
          </div>
        </div>

        {/* Tombol Cadangan & Hapus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportAll}
            className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition-colors space-y-1.5"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
              <Download className="w-4 h-4 text-emerald-700" />
              Ekspor Cadangan (JSON)
            </div>
            <p className="text-[11px] text-emerald-700">
              Unduh salinan cadangan ke penyimpanan perangkat Anda
            </p>
          </button>

          <label className="p-4 rounded-2xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 text-left transition-colors cursor-pointer space-y-1.5 block">
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            <div className="flex items-center gap-2 font-bold text-xs text-teal-900">
              <Upload className="w-4 h-4 text-teal-700" />
              Impor Cadangan (JSON)
            </div>
            <p className="text-[11px] text-teal-700">
              Pulihkan data riwayat dari berkas JSON di perangkat
            </p>
          </label>

          <button
            type="button"
            onClick={handlePurgeDemo}
            className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-left transition-colors space-y-1.5"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
              <Trash2 className="w-4 h-4 text-amber-700" />
              Hapus Semua Data Demo
            </div>
            <p className="text-[11px] text-amber-700">
              Bersihkan seluruh data contoh agar tersisa data asli
            </p>
          </button>

          <button
            type="button"
            onClick={handleClearAllStorage}
            className="p-4 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 text-left transition-colors space-y-1.5"
          >
            <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              Kosongkan Local Storage
            </div>
            <p className="text-[11px] text-rose-700">
              Hapus semua riwayat telaah di perangkat ini
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
