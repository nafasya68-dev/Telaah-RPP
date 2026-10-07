import React, { useState } from 'react';
import {
  Award,
  Calendar,
  User,
  GraduationCap,
  Clock,
  BookOpen,
  Printer,
  FileDown,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Save,
  Check,
  RotateCcw,
  GitCompare,
} from 'lucide-react';
import { AnalysisReport, IndicatorResult, ScoreType } from '../types/telaah';
import { calculateSummary, buildPriorities, buildIncompatibilities, generateFeedback, generateReviewDescription } from '../data/instruments';
import { printOrSavePdfReport, downloadDocxReport, downloadJsonReport } from '../utils/export';
import { toIsoDate, formatIndonesianDate } from '../utils/date';
import { purgeProfilPelajarPancasila } from '../utils/textPurge';

interface ReportDetailViewProps {
  report: AnalysisReport;
  allReports?: AnalysisReport[];
  onUpdateReport: (updated: AnalysisReport) => void;
  onOpenFullEditModal: () => void;
  onNavigateNew: () => void;
  onOpenComparison?: (teacherName?: string, reportId?: string) => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  allReports = [],
  onUpdateReport,
  onOpenFullEditModal,
  onNavigateNew,
  onOpenComparison,
}) => {
  const [filterScore, setFilterScore] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingIndicatorId, setEditingIndicatorId] = useState<number | null>(null);
  const [savedSuccessToast, setSavedSuccessToast] = useState<boolean>(false);

  // Local state for inline quick editing of single indicator
  const [editScore, setEditScore] = useState<ScoreType>(2);
  const [editEvidence, setEditEvidence] = useState<string>('');
  const [editComment, setEditComment] = useState<string>('');
  const [editRecommendation, setEditRecommendation] = useState<string>('');

  const { identity, summary, indicators, priorities, incompatibleComponents, extraNotes, feedback, reviewDescription } = report;

  const teacherKey = (identity.teacherName || '').trim().toLowerCase();
  const otherReportsSameTeacher = allReports.filter(
    (r) => r.id !== report.id && (r.identity.teacherName || '').trim().toLowerCase() === teacherKey
  );
  const hasRevisions = otherReportsSameTeacher.length > 0;

  const startInlineEdit = (ind: IndicatorResult) => {
    setEditingIndicatorId(ind.id);
    setEditScore(ind.score);
    setEditEvidence(ind.evidence);
    setEditComment(ind.criticalComment);
    setEditRecommendation(ind.recommendation);
  };

  const cancelInlineEdit = () => {
    setEditingIndicatorId(null);
  };

  const saveInlineEdit = () => {
    if (editingIndicatorId === null) return;

    const updatedIndicators = indicators.map((ind) => {
      if (ind.id === editingIndicatorId) {
        let status = ind.status;
        if (editScore === 2) status = 'Terpenuhi Optimal';
        else if (editScore === 1) status = 'Terpenuhi Sebagian';
        else if (editScore === 0) status = 'Belum Terpenuhi';
        else if (editScore === 'N/A') status = 'N/A';

        return {
          ...ind,
          score: editScore,
          status,
          evidence: editEvidence,
          criticalComment: editComment,
          recommendation: editRecommendation,
        };
      }
      return ind;
    });

    const newSummary = calculateSummary(updatedIndicators);
    const newPriorities = buildPriorities(updatedIndicators);
    const newIncompatibilities = buildIncompatibilities(updatedIndicators);
    const newFeedback = generateFeedback(updatedIndicators, newSummary);
    const newDesc = generateReviewDescription(newSummary, updatedIndicators);

    const updatedReport: AnalysisReport = {
      ...report,
      updatedAt: new Date().toISOString(),
      indicators: updatedIndicators,
      summary: newSummary,
      priorities: newPriorities,
      incompatibleComponents: newIncompatibilities,
      feedback: newFeedback,
      reviewDescription: newDesc,
    };

    onUpdateReport(updatedReport);
    setEditingIndicatorId(null);

    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 3000);
  };

  const handleDirectDateChange = (newIsoDate: string) => {
    const formatted = formatIndonesianDate(newIsoDate);
    const updatedReport: AnalysisReport = {
      ...report,
      updatedAt: new Date().toISOString(),
      identity: {
        ...report.identity,
        uploadDate: formatted,
        reviewDate: formatted,
      },
    };
    onUpdateReport(updatedReport);
    setSavedSuccessToast(true);
    setTimeout(() => setSavedSuccessToast(false), 2500);
  };

  // Filter indicators for display
  const filteredIndicators = indicators.filter((ind) => {
    if (filterScore === '2' && ind.score !== 2) return false;
    if (filterScore === '1' && ind.score !== 1) return false;
    if (filterScore === '0' && ind.score !== 0) return false;
    if (filterScore === 'na' && ind.score !== 'N/A') return false;
    if (filterScore === 'wajib' && ind.isOptional) return false;
    if (filterScore === 'opsional' && !ind.isOptional) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = ind.name.toLowerCase().includes(q);
      const inEv = (ind.evidence || '').toLowerCase().includes(q);
      const inComm = (ind.criticalComment || '').toLowerCase().includes(q);
      const inRec = (ind.recommendation || '').toLowerCase().includes(q);
      return inName || inEv || inComm || inRec;
    }

    return true;
  });

  const getStatusBadge = (score: ScoreType) => {
    if (score === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Terpenuhi Optimal (2)
        </span>
      );
    }
    if (score === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5" /> Terpenuhi Sebagian (1)
        </span>
      );
    }
    if (score === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5" /> Belum Terpenuhi (0)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
        <HelpCircle className="w-3.5 h-3.5" /> N/A (Tidak Dihitung)
      </span>
    );
  };

  const predicateBadgeStyle =
    summary.predicate === 'SANGAT BAIK'
      ? 'from-emerald-600 to-teal-600 text-white shadow-emerald-500/25'
      : summary.predicate === 'BAIK'
      ? 'from-sky-600 to-blue-600 text-white shadow-sky-500/25'
      : summary.predicate === 'CUKUP'
      ? 'from-amber-500 to-amber-600 text-white shadow-amber-500/25'
      : 'from-rose-600 to-rose-700 text-white shadow-rose-500/25';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {savedSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-700 animate-in slide-in-from-bottom duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          Perubahan telaah berhasil disimpan dan nilai akhir dihitung ulang!
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Laporan Resmi Hasil Telaah
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {identity.title || report.fileName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs text-slate-500">
              Satuan Pendidikan: <strong className="text-slate-700">{identity.school || '-'}</strong> | Guru: <strong className="text-slate-700">{identity.teacherName || '-'}</strong>
            </p>
            {report.aiEngine && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Dianalisis: {report.aiEngine}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => printOrSavePdfReport(report)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Cetak / PDF
          </button>

          <button
            type="button"
            onClick={() => downloadDocxReport(report)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4 text-teal-700" />
            Download Word (DOC)
          </button>

          <button
            type="button"
            onClick={() => downloadJsonReport(report)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            JSON
          </button>

          {onOpenComparison && (
            <button
              type="button"
              onClick={() => onOpenComparison(identity.teacherName, report.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-xl shadow-xs transition-colors"
              title="Bandingkan Hasil Telaah Sebelum dan Sesudah Revisi"
            >
              <GitCompare className="w-4 h-4 text-emerald-600" />
              <span>Komparasi Revisi</span>
              {hasRevisions && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {otherReportsSameTeacher.length + 1} Versi
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFullEditModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Manual Lengkap
          </button>
        </div>
      </div>

      {/* Notifikasi Versi Revisi Lain dari Guru yang Sama */}
      {hasRevisions && onOpenComparison && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">
                Tersedia {otherReportsSameTeacher.length} Versi Telaah Lain untuk Guru Ini ({identity.teacherName})
              </p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Bandingkan hasil telaah sebelum dan sesudah revisi untuk memantau peningkatan kualitas 22 indikator Pembelajaran Mendalam secara berdampingan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenComparison(identity.teacherName, report.id)}
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Buka Komparasi Revisi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bagian Paling Atas: Banner Nilai Akhir, Predikat, Tindak Lanjut */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Nilai Akhir Box */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              NILAI AKHIR
            </span>
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight my-2">
              {summary.finalScore.toFixed(2)}
            </div>
            <p className="text-xs text-slate-300">
              Skala 100 • Standar Pembelajaran Mendalam
            </p>
          </div>

          {/* Predikat & Tindak Lanjut */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6 space-y-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                PREDIKAT
              </span>
              <div
                className={`inline-block px-4 py-1.5 rounded-2xl bg-gradient-to-r text-base font-extrabold tracking-wide shadow-lg ${predicateBadgeStyle}`}
              >
                {summary.predicate}
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                TINDAK LANJUT SUPERVISI
              </span>
              <div className="text-sm font-bold text-sky-300">
                {summary.followUpCategory}
              </div>
            </div>
          </div>

          {/* Rekapitulasi Statistik Indikator */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Indikator</span>
              <div className="text-xl font-bold text-white mt-1">{summary.totalIndicators}</div>
              <span className="text-[9px] text-slate-400">Instrumen Lengkap</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Indikator Dinilai</span>
              <div className="text-xl font-bold text-emerald-300 mt-1">{summary.evaluatedCount}</div>
              <span className="text-[9px] text-slate-400">N/A: {summary.naCount} (Opsional)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 col-span-2">
              <div className="flex items-center justify-between text-xs mb-1 px-1">
                <span className="text-slate-300">Total Skor Diperoleh:</span>
                <strong className="text-emerald-400 font-bold">
                  {summary.totalScore} / {summary.maxPossibleScore}
                </strong>
              </div>
              <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${summary.maxPossibleScore > 0 ? (summary.totalScore / summary.maxPossibleScore) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan Cepat: Kekuatan Utama, Prioritas, Deskripsi, Tindak Lanjut */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kekuatan Utama */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Kekuatan Utama
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {purgeProfilPelajarPancasila(feedback.strengths[0]) || 'Perencanaan memiliki kerangka yang jelas.'}
          </p>
        </div>

        {/* Prioritas Perbaikan */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 bg-rose-50/20 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            Prioritas Perbaikan
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {priorities.length > 0
              ? purgeProfilPelajarPancasila(`${priorities[0].indicatorName}: ${priorities[0].issue}`)
              : 'Tidak ada indikator berkategori skor 0.'}
          </p>
        </div>

        {/* Deskripsi Hasil Telaah */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Deskripsi Kualitas
          </div>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {purgeProfilPelajarPancasila(reviewDescription)}
          </p>
        </div>

        {/* Arahan Tindak Lanjut */}
        <div className="bg-white rounded-2xl p-5 border border-sky-200/80 bg-sky-50/20 shadow-xs">
          <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ArrowRight className="w-4 h-4" />
            Arahan Supervisi
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Kategori: <strong>{summary.followUpCategory}</strong>. {purgeProfilPelajarPancasila(feedback.followUpSteps[1]) || 'Sempurnakan sesuai rekomendasi.'}
          </p>
        </div>
      </div>

      {/* Identitas Dokumen Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Identitas RPP / Modul Ajar
            </h2>
            <p className="text-xs text-slate-500">
              Informasi data kurikuler yang teridentifikasi dari dokumen
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFullEditModal}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Identitas
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Guru Pengampu</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{identity.teacherName || '-'}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              NIP: {identity.teacherNip || '-'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Penelaah / Asesor</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{identity.reviewerName || '-'}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              NIP: {identity.reviewerNip || '-'}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Satuan Pendidikan</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{identity.school || '-'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Mata Pelajaran &amp; Fase</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{identity.subject || '-'} ({identity.gradePhase || '-'})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Alokasi Waktu</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{identity.timeAllocation || '-'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-emerald-800 font-semibold block text-[11px] mb-1">
              Tanggal Telaah
            </span>
            <div className="relative flex items-center">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
              <input
                type="date"
                value={toIsoDate(identity.uploadDate || identity.reviewDate)}
                onChange={(e) => handleDirectDateChange(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-white border border-emerald-300 hover:border-emerald-500 rounded-xl pl-8 pr-2 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer shadow-xs transition-colors"
                title="Pilih tanggal telaah di kalender"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel 22 Indikator Hasil Telaah */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tabel Telaah 22 Indikator Pembelajaran Mendalam
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi kritis berbasis bukti dokumen dan rekomendasi perbaikan
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari indikator / kata kunci..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1">
              <select
                value={filterScore}
                onChange={(e) => setFilterScore(e.target.value)}
                className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua Skor ({indicators.length})</option>
                <option value="2">Skor 2 (Optimal)</option>
                <option value="1">Skor 1 (Sebagian)</option>
                <option value="0">Skor 0 (Belum Ada)</option>
                <option value="na">Skor N/A (Opsional)</option>
                <option value="wajib">Hanya Wajib (17)</option>
                <option value="opsional">Hanya Opsional (5)</option>
              </select>
            </div>
          </div>
        </div>

        {/* The 22 Indicators Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3 text-center w-12">No</th>
                <th className="py-3.5 px-4 w-48">Indikator</th>
                <th className="py-3.5 px-3 text-center w-36">Status &amp; Skor</th>
                <th className="py-3.5 px-4">Bukti / Temuan Dokumen</th>
                <th className="py-3.5 px-4">Komentar Kritis</th>
                <th className="py-3.5 px-4">Rekomendasi</th>
                <th className="py-3.5 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredIndicators.map((ind) => {
                const isEditingThis = editingIndicatorId === ind.id;

                if (isEditingThis) {
                  return (
                    <tr key={ind.id} className="bg-emerald-50/60 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-700 align-top">
                        {ind.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 align-top">
                        {ind.name}
                        {ind.isOptional && (
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                            (Komponen Opsional)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 align-top">
                        <select
                          value={editScore}
                          onChange={(e) => {
                            const val = e.target.value === 'N/A' ? 'N/A' : (Number(e.target.value) as ScoreType);
                            setEditScore(val);
                          }}
                          className="w-full text-xs p-1.5 rounded-lg border border-emerald-400 bg-white font-bold"
                        >
                          <option value={2}>2 - Optimal</option>
                          <option value={1}>1 - Sebagian</option>
                          <option value={0}>0 - Belum Ada</option>
                          {ind.isOptional && <option value="N/A">N/A - Tidak Relevan</option>}
                        </select>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <textarea
                          rows={3}
                          value={editEvidence}
                          onChange={(e) => setEditEvidence(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-400 bg-white focus:outline-hidden"
                          placeholder="Bukti temuan dalam dokumen..."
                        />
                      </td>
                      <td className="py-3 px-4 align-top">
                        <textarea
                          rows={3}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-400 bg-white focus:outline-hidden"
                          placeholder="Komentar kritis..."
                        />
                      </td>
                      <td className="py-3 px-4 align-top">
                        <textarea
                          rows={3}
                          value={editRecommendation}
                          onChange={(e) => setEditRecommendation(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-emerald-400 bg-white focus:outline-hidden"
                          placeholder="Rekomendasi..."
                        />
                      </td>
                      <td className="py-3 px-3 align-top text-center space-y-1">
                        <button
                          type="button"
                          onClick={saveInlineEdit}
                          className="w-full p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" /> Simpan
                        </button>
                        <button
                          type="button"
                          onClick={cancelInlineEdit}
                          className="w-full p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px]"
                        >
                          Batal
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={ind.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      ind.score === 0 ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700 align-top">
                      {ind.id}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-bold text-slate-900 block">{ind.name}</span>
                      {ind.isOptional && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          (Komponen Opsional)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center align-top">
                      {getStatusBadge(ind.score)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed align-top">
                      {ind.evidence ? (
                        <span>{purgeProfilPelajarPancasila(ind.evidence)}</span>
                      ) : (
                        <span className="text-slate-400 italic">
                          Tidak ditemukan bukti yang mendukung indikator ini dalam dokumen.
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed align-top">
                      {purgeProfilPelajarPancasila(ind.criticalComment) || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed align-top">
                      {purgeProfilPelajarPancasila(ind.recommendation) || '-'}
                    </td>
                    <td className="py-3.5 px-3 text-center align-top">
                      <button
                        type="button"
                        onClick={() => startInlineEdit(ind)}
                        title="Edit Penilaian Indikator Ini"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Komponen Yang Belum Sesuai */}
      {incompatibleComponents.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-rose-950 tracking-tight">
                KOMPONEN YANG BELUM SESUAI
              </h2>
              <p className="text-xs text-rose-700">
                Deteksi ketidaksesuaian indikator wajib, keselarasan instruksional, atau asesmen
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-rose-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50 text-rose-900 font-bold uppercase tracking-wider border-b border-rose-200">
                <tr>
                  <th className="py-3 px-4 w-48">Indikator</th>
                  <th className="py-3 px-4">Temuan Dokumen</th>
                  <th className="py-3 px-4">Alasan Tidak Sesuai</th>
                  <th className="py-3 px-4">Rekomendasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {incompatibleComponents.map((c, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/40">
                    <td className="py-3 px-4 font-bold text-rose-900 align-top">
                      {c.indicatorName}
                    </td>
                    <td className="py-3 px-4 text-slate-700 align-top">{c.finding}</td>
                    <td className="py-3 px-4 text-rose-800 font-medium align-top">{c.reason}</td>
                    <td className="py-3 px-4 text-slate-800 align-top">{c.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prioritas Perbaikan */}
      {priorities.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                PRIORITAS PERBAIKAN
              </h2>
              <p className="text-xs text-slate-500">
                Daftar aspek yang harus segera disempurnakan berdasarkan urgensi skor
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 text-center w-28">Tingkat Prioritas</th>
                  <th className="py-3 px-4 w-48">Indikator</th>
                  <th className="py-3 px-3 text-center w-16">Skor</th>
                  <th className="py-3 px-4">Masalah / Temuan</th>
                  <th className="py-3 px-4">Rekomendasi Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {priorities.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center align-top">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.level === 'Sangat Tinggi'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : p.level === 'Tinggi'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {p.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 align-top">
                      {p.indicatorName}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700 align-top">
                      {p.score}
                    </td>
                    <td className="py-3 px-4 text-slate-700 align-top">{p.issue}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium align-top">{p.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Umpan Balik Perencanaan Pembelajaran */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            UMPAN BALIK PERENCANAAN PEMBELAJARAN
          </h2>
          <p className="text-xs text-slate-500">
            Analisis diagnostik menyeluruh untuk guru dan penelaah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kelebihan */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              A. Kelebihan Utama Perencanaan
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {feedback.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{purgeProfilPelajarPancasila(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hal yang Perlu Ditingkatkan */}
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              B. Hal yang Perlu Ditingkatkan
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {feedback.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                  <span>{purgeProfilPelajarPancasila(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rekomendasi Praktis */}
          <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-3">
            <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-700" />
              C. Rekomendasi Praktis Implementatif
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {feedback.practicalRecommendations.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <span>{purgeProfilPelajarPancasila(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tindak Lanjut Supervisi */}
          <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
            <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-teal-700" />
              D. Tindak Lanjut Supervisi Klinis
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {feedback.followUpSteps.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{purgeProfilPelajarPancasila(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Catatan Tambahan di Luar Instrumen (Jika Ada) */}
      {extraNotes.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              CATATAN TAMBAHAN DI LUAR INSTRUMEN
            </h2>
            <span className="text-[11px] text-slate-400 italic">
              Tidak memengaruhi nilai akhir 22 indikator
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Komponen ini tidak termasuk dalam 22 indikator instrumen sehingga tidak diperhitungkan dalam nilai akhir.
          </p>

          <div className="divide-y divide-slate-100">
            {extraNotes.map((note, idx) => (
              <div key={idx} className="py-3 text-xs space-y-1">
                <strong className="text-slate-800">{note.componentName}</strong>
                <p className="text-slate-600">{note.finding}</p>
                <p className="text-emerald-700 font-medium">Rekomendasi: {note.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lembar Pengesahan Supervisi & Tanda Tangan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            LEMBAR PENGESAHAN HASIL TELAAH &amp; SUPERVISI AKADEMIK
          </h2>
          <p className="text-xs text-slate-500">
            Konfirmasi resmi hasil evaluasi dokumen perencanaan pembelajaran
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Guru Pengampu */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 text-center flex flex-col justify-between min-h-[170px]">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Mengetahui / Mengonfirmasi,
              </span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5">
                Guru Mata Pelajaran / Penyusun RPP
              </span>
            </div>
            <div className="pt-10">
              <strong className="text-xs font-bold text-slate-900 block">
                {identity.teacherName || '( .................................................... )'}
              </strong>
              <span className="text-[11px] text-slate-600 font-mono block mt-0.5">
                NIP. {identity.teacherNip || '......................................................'}
              </span>
            </div>
          </div>

          {/* Penelaah / Asesor */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center flex flex-col justify-between min-h-[170px]">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {identity.school ? identity.school.split(' ')[0] : 'Kota'}, {identity.reviewDate || identity.uploadDate || new Date().toLocaleDateString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5">
                Penelaah / Asesor Supervisi Akademik
              </span>
            </div>
            <div className="pt-10">
              <strong className="text-xs font-bold text-slate-900 block">
                {identity.reviewerName || '( .................................................... )'}
              </strong>
              <span className="text-[11px] text-slate-600 font-mono block mt-0.5">
                NIP. {identity.reviewerNip || '......................................................'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
