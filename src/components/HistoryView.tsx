import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Download,
  Trash2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Archive,
  CheckCircle2,
  FileText,
  GitCompare,
} from 'lucide-react';
import { AnalysisReport, PredicateType } from '../types/telaah';
import { ConfirmationModal } from './ConfirmationModal';
import { printOrSavePdfReport, downloadDocxReport } from '../utils/export';

interface HistoryViewProps {
  reports: AnalysisReport[];
  recycleBinReports: AnalysisReport[];
  onSelectReport: (report: AnalysisReport) => void;
  onEditReport: (report: AnalysisReport) => void;
  onSoftDeleteReport: (reportId: string) => void;
  onRestoreReport: (reportId: string) => void;
  onPermanentDeleteReport: (reportId: string) => void;
  onClearAllActiveReports: () => void;
  onClearRecycleBin: () => void;
  onOpenComparison?: (teacherName?: string, reportId?: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  reports,
  recycleBinReports,
  onSelectReport,
  onEditReport,
  onSoftDeleteReport,
  onRestoreReport,
  onPermanentDeleteReport,
  onClearAllActiveReports,
  onClearRecycleBin,
  onOpenComparison,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [predicateFilter, setPredicateFilter] = useState<string>('all');

  // Single Delete Confirmation Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPermanentTarget, setIsPermanentTarget] = useState<boolean>(false);

  // Bulk Delete Confirmation Modal State
  const [isClearAllActiveModalOpen, setIsClearAllActiveModalOpen] = useState<boolean>(false);
  const [isClearTrashModalOpen, setIsClearTrashModalOpen] = useState<boolean>(false);

  // Success Notification banner
  const [alertSuccess, setAlertSuccess] = useState<string>('');

  // Teacher counts for revision indicator
  const teacherDocCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    reports.forEach((r) => {
      const k = (r.identity?.teacherName || '').trim().toLowerCase();
      if (k) counts.set(k, (counts.get(k) || 0) + 1);
    });
    return counts;
  }, [reports]);

  const showNotification = (msg: string) => {
    setAlertSuccess(msg);
    setTimeout(() => setAlertSuccess(''), 3500);
  };

  const handleConfirmSingleDelete = () => {
    if (!deleteTargetId) return;

    if (isPermanentTarget) {
      onPermanentDeleteReport(deleteTargetId);
      showNotification('Dokumen berhasil dihapus permanen.');
    } else {
      onSoftDeleteReport(deleteTargetId);
      showNotification('RPP/Modul Ajar dan hasil telaah berhasil dipindahkan ke Tempat Sampah.');
    }
    setDeleteTargetId(null);
  };

  const currentList = activeTab === 'active' ? reports : recycleBinReports;

  const filteredReports = currentList.filter((r) => {
    if (predicateFilter !== 'all' && r.summary.predicate !== predicateFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = (r.identity.title || '').toLowerCase().includes(q);
      const inTeacher = (r.identity.teacherName || '').toLowerCase().includes(q);
      const inSchool = (r.identity.school || '').toLowerCase().includes(q);
      const inSubject = (r.identity.subject || '').toLowerCase().includes(q);
      const inFileName = (r.fileName || '').toLowerCase().includes(q);
      return inTitle || inTeacher || inSchool || inSubject || inFileName;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            RIWAYAT TELAAH RPP / MODUL AJAR
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola, telusuri, pulihkan, atau cetak kembali seluruh dokumen supervisi yang tersimpan
          </p>
        </div>

        {/* Tab switch Active vs Trash */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenComparison && reports.length >= 2 && activeTab === 'active' && (
            <button
              type="button"
              onClick={() => onOpenComparison()}
              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Bandingkan Hasil Telaah Sebelum dan Sesudah Revisi"
            >
              <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Komparasi Revisi</span>
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Aktif ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trash')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                activeTab === 'trash'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Tempat Sampah ({recycleBinReports.length})
            </button>
          </div>

          {activeTab === 'active' && reports.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearAllActiveModalOpen(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors"
            >
              Hapus Semua Riwayat
            </button>
          )}

          {activeTab === 'trash' && recycleBinReports.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearTrashModalOpen(true)}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Kosongkan Tempat Sampah
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {alertSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {alertSuccess}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari guru, sekolah, mapel, atau judul..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Predikat:</span>
          <select
            value={predicateFilter}
            onChange={(e) => setPredicateFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Predikat</option>
            <option value="SANGAT BAIK">Sangat Baik (86-100)</option>
            <option value="BAIK">Baik (76-85)</option>
            <option value="CUKUP">Cukup (66-75)</option>
            <option value="PERLU PERBAIKAN">Perlu Perbaikan (≤65)</option>
          </select>
        </div>
      </div>

      {/* Table of Reports */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {activeTab === 'trash' ? 'Tempat Sampah Kosong' : 'Tidak Ada Dokumen yang Sesuai'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'trash'
                ? 'Tidak ada data RPP atau hasil telaah yang dihapus sementara.'
                : 'Coba ubah kata kunci pencarian atau filter predikat di atas.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-44">Guru &amp; Satuan Pendidikan</th>
                  <th className="py-3.5 px-4">Judul RPP / Modul Ajar</th>
                  <th className="py-3.5 px-4 w-32">Mapel &amp; Fase</th>
                  <th className="py-3.5 px-3 w-28 text-center">Tanggal Telaah</th>
                  <th className="py-3.5 px-3 w-24 text-center">Nilai</th>
                  <th className="py-3.5 px-3 w-32 text-center">Predikat</th>
                  <th className="py-3.5 px-4 w-36 text-center">Menu Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => {
                  const { identity, summary } = report;
                  const predBadge =
                    summary.predicate === 'SANGAT BAIK'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : summary.predicate === 'BAIK'
                      ? 'bg-sky-100 text-sky-800 border-sky-200'
                      : summary.predicate === 'CUKUP'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200';

                  const teacherKey = (identity.teacherName || '').trim().toLowerCase();
                  const teacherHasRevisions = (teacherDocCounts.get(teacherKey) || 0) >= 2;

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <strong className="text-slate-900 block truncate">{identity.teacherName || '-'}</strong>
                        {identity.teacherNip && (
                          <span className="text-[10px] font-mono text-slate-500 block truncate">
                            NIP: {identity.teacherNip}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 block truncate">{identity.school || '-'}</span>
                        {teacherHasRevisions && activeTab === 'active' && (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <GitCompare className="w-2.5 h-2.5" />
                            Ada Revisi ({teacherDocCounts.get(teacherKey)} Versi)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top">
                        <button
                          type="button"
                          onClick={() => onSelectReport(report)}
                          className="font-bold text-slate-800 hover:text-emerald-700 text-left line-clamp-2 transition-colors"
                        >
                          {identity.title || report.fileName}
                        </button>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Tindak lanjut: <strong className="text-slate-600">{summary.followUpCategory}</strong>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top text-slate-700">
                        <strong className="block">{identity.subject || '-'}</strong>
                        <span className="text-[11px] text-slate-500">{identity.gradePhase || '-'}</span>
                      </td>

                      <td className="py-3.5 px-3 text-center align-top text-slate-600">
                        {identity.reviewDate || new Date(report.createdAt).toLocaleDateString('id-ID')}
                      </td>

                      <td className="py-3.5 px-3 text-center align-top">
                        <span className="text-sm font-black text-slate-900 block">
                          {summary.finalScore.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {summary.totalScore}/{summary.maxPossibleScore}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center align-top">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${predBadge}`}>
                          {summary.predicate}
                        </span>
                      </td>

                      {/* Menu Aksi: Lihat, Edit, Download, Komparasi, Hapus */}
                      <td className="py-3.5 px-4 text-center align-top">
                        {activeTab === 'active' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => onSelectReport(report)}
                              title="Lihat Hasil Telaah"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {onOpenComparison && (
                              <button
                                type="button"
                                onClick={() => onOpenComparison(identity.teacherName, report.id)}
                                title="Bandingkan Revisi Guru Ini"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 transition-colors"
                              >
                                <GitCompare className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onEditReport(report)}
                              title="Edit Penilaian Manual"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadDocxReport(report)}
                              title="Download Word (DOC)"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-700 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTargetId(report.id);
                                setIsPermanentTarget(false);
                              }}
                              title="Hapus RPP & Hasil Telaah"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onRestoreReport(report.id);
                                showNotification('Dokumen berhasil dipulihkan.');
                              }}
                              title="Pulihkan Dokumen"
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" /> Pulihkan
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTargetId(report.id);
                                setIsPermanentTarget(true);
                              }}
                              title="Hapus Permanen"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Single Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title={isPermanentTarget ? 'Hapus Permanen Dokumen?' : 'Hapus RPP / Modul Ajar dan Hasil Telaah'}
        message={
          isPermanentTarget
            ? 'Dokumen dan seluruh riwayat telaah ini akan dihapus secara permanen dan tidak dapat dipulihkan kembali.'
            : 'Apakah Anda yakin ingin menghapus RPP/Modul Ajar dan hasil telaah ini? Dokumen akan dipindahkan ke Tempat Sampah dan dapat dipulihkan sewaktu-waktu.'
        }
        confirmLabel={isPermanentTarget ? 'Ya, Hapus Permanen' : 'Ya, Hapus'}
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleConfirmSingleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Clear All Active Confirmation Modal (Double Warning) */}
      <ConfirmationModal
        isOpen={isClearAllActiveModalOpen}
        title="Hapus Semua Riwayat Telaah?"
        message="PERINGATAN: Semua dokumen RPP dan hasil telaah aktif akan dipindahkan ke Tempat Sampah. Anda masih dapat memulihkannya dari tab Tempat Sampah."
        confirmLabel="Ya, Pindahkan Semua"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={() => {
          onClearAllActiveReports();
          setIsClearAllActiveModalOpen(false);
          showNotification('Seluruh riwayat aktif berhasil dipindahkan ke Tempat Sampah.');
        }}
        onCancel={() => setIsClearAllActiveModalOpen(false)}
      />

      {/* Clear Trash Confirmation Modal (Permanent Wipe) */}
      <ConfirmationModal
        isOpen={isClearTrashModalOpen}
        title="KOSONGKAN TEMPAT SAMPAH"
        message="PERINGATAN: Semua dokumen dan hasil telaah di Tempat Sampah akan dihapus secara permanen dan tidak dapat dikembalikan. Apakah Anda yakin?"
        confirmLabel="Ya, Hapus Semua Permanen"
        cancelLabel="Batal"
        isDestructive={true}
        isDoubleWarning={true}
        onConfirm={() => {
          onClearRecycleBin();
          setIsClearTrashModalOpen(false);
          showNotification('Tempat Sampah berhasil dikosongkan.');
        }}
        onCancel={() => setIsClearTrashModalOpen(false)}
      />
    </div>
  );
};
