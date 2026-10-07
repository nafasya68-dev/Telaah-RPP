import React, { useState, useMemo, useEffect } from 'react';
import {
  GitCompare,
  TrendingUp,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Calendar,
  User,
  GraduationCap,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Clock,
  Layers,
  Award,
  ChevronDown,
  Info,
} from 'lucide-react';
import { AnalysisReport, IndicatorResult, ScoreType } from '../types/telaah';
import { printOrSaveComparisonReport, downloadDocxComparisonReport } from '../utils/export';
import { purgeProfilPelajarPancasila } from '../utils/textPurge';

interface ComparisonViewProps {
  reports: AnalysisReport[];
  initialTeacherName?: string;
  initialBeforeReportId?: string;
  initialAfterReportId?: string;
  onSelectReport: (report: AnalysisReport) => void;
  onNavigateNewWithTeacher?: (teacherName: string, schoolName: string, subject: string, teacherNip?: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  reports,
  initialTeacherName,
  initialBeforeReportId,
  initialAfterReportId,
  onSelectReport,
  onNavigateNewWithTeacher,
}) => {
  // Group reports by teacher (case-insensitive & trimmed)
  const teacherMap = useMemo(() => {
    const map = new Map<string, { displayName: string; reports: AnalysisReport[] }>();

    reports.forEach((rep) => {
      const rawName = rep.identity?.teacherName?.trim() || 'Guru Pengampu';
      const key = rawName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { displayName: rawName, reports: [] });
      }
      map.get(key)!.reports.push(rep);
    });

    // Sort reports within each teacher by date ascending
    map.forEach((item) => {
      item.reports.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.identity.reviewDate || 0).getTime();
        const dateB = new Date(b.createdAt || b.identity.reviewDate || 0).getTime();
        return dateA - dateB;
      });
    });

    return map;
  }, [reports]);

  // List of teachers
  const teacherList = useMemo(() => {
    return Array.from(teacherMap.entries()).map(([key, val]) => ({
      key,
      name: val.displayName,
      count: val.reports.length,
      hasRevisions: val.reports.length >= 2,
      school: val.reports[0]?.identity?.school || '',
    })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [teacherMap]);

  // Determine initial teacher
  const defaultTeacherKey = useMemo(() => {
    if (initialTeacherName) {
      const match = teacherList.find((t) => t.name.toLowerCase() === initialTeacherName.toLowerCase());
      if (match) return match.key;
    }
    // Find first teacher with 2+ reports
    const withRevisions = teacherList.find((t) => t.hasRevisions);
    if (withRevisions) return withRevisions.key;
    return teacherList[0]?.key || '';
  }, [initialTeacherName, teacherList]);

  const [selectedTeacherKey, setSelectedTeacherKey] = useState<string>(defaultTeacherKey);
  const [crossTeacherMode, setCrossTeacherMode] = useState<boolean>(false);

  // Sync when initialTeacherName or teacherList changes
  useEffect(() => {
    if (initialTeacherName) {
      const match = teacherList.find((t) => t.name.toLowerCase() === initialTeacherName.toLowerCase());
      if (match && match.key !== selectedTeacherKey) {
        setSelectedTeacherKey(match.key);
      }
    }
  }, [initialTeacherName, teacherList]);

  // Current active teacher group
  const activeTeacherGroup = teacherMap.get(selectedTeacherKey);
  const teacherReports = activeTeacherGroup?.reports || [];

  // Before & After selection
  const [beforeReportId, setBeforeReportId] = useState<string>(() => {
    if (initialBeforeReportId) return initialBeforeReportId;
    if (teacherReports.length >= 2) return teacherReports[0].id;
    return teacherReports[0]?.id || reports[0]?.id || '';
  });

  const [afterReportId, setAfterReportId] = useState<string>(() => {
    if (initialAfterReportId) return initialAfterReportId;
    if (teacherReports.length >= 2) return teacherReports[teacherReports.length - 1].id;
    return teacherReports[1]?.id || reports[1]?.id || reports[0]?.id || '';
  });

  // Sync specific report IDs from props if provided
  useEffect(() => {
    if (initialBeforeReportId) {
      setBeforeReportId(initialBeforeReportId);
    }
    if (initialAfterReportId) {
      setAfterReportId(initialAfterReportId);
    }
  }, [initialBeforeReportId, initialAfterReportId]);

  // When teacher changes, auto-select their first and last report
  const handleTeacherChange = (newKey: string) => {
    setSelectedTeacherKey(newKey);
    const grp = teacherMap.get(newKey);
    if (grp && grp.reports.length >= 2) {
      setBeforeReportId(grp.reports[0].id);
      setAfterReportId(grp.reports[grp.reports.length - 1].id);
    } else if (grp && grp.reports.length === 1) {
      setBeforeReportId(grp.reports[0].id);
      // keep or pick another
      setAfterReportId(grp.reports[0].id);
    }
  };

  // Swap before & after
  const handleSwapReports = () => {
    const temp = beforeReportId;
    setBeforeReportId(afterReportId);
    setAfterReportId(temp);
  };

  // Resolving actual report objects
  const beforeReport = useMemo(() => {
    return reports.find((r) => r.id === beforeReportId) || reports[0] || null;
  }, [reports, beforeReportId]);

  const afterReport = useMemo(() => {
    return reports.find((r) => r.id === afterReportId) || reports[1] || reports[0] || null;
  }, [reports, afterReportId]);

  // Filters for indicators table
  const [filterMode, setFilterMode] = useState<'all' | 'improved' | 'suboptimal' | 'optimal'>('all');
  const [indicatorSearch, setIndicatorSearch] = useState<string>('');

  // Delta calculations
  const deltaMetrics = useMemo(() => {
    if (!beforeReport || !afterReport) return null;

    const beforeScore = beforeReport.summary.finalScore;
    const afterScore = afterReport.summary.finalScore;
    const delta = afterScore - beforeScore;
    const deltaPercent = beforeScore > 0 ? (delta / beforeScore) * 100 : 0;

    let improved = 0;
    let optimalBoth = 0;
    let regressed = 0;
    let unchanged = 0;

    beforeReport.indicators.forEach((bInd) => {
      const aInd = afterReport.indicators.find((a) => a.id === bInd.id);
      if (!aInd) return;

      const bVal = typeof bInd.score === 'number' ? bInd.score : -1;
      const aVal = typeof aInd.score === 'number' ? aInd.score : -1;

      if (bVal !== -1 && aVal !== -1) {
        if (aVal > bVal) improved++;
        else if (aVal < bVal) regressed++;
        else if (aVal === 2) optimalBoth++;
        else unchanged++;
      } else if (bVal === -1 && aVal !== -1) {
        improved++;
      } else if (bVal === -1 && aVal === -1) {
        unchanged++;
      }
    });

    const isSameReport = beforeReport.id === afterReport.id;

    return {
      beforeScore,
      afterScore,
      delta,
      deltaPercent,
      improved,
      optimalBoth,
      regressed,
      unchanged,
      isSameReport,
      isImprovedOverall: delta > 0,
    };
  }, [beforeReport, afterReport]);

  // Filtered indicators
  const displayedIndicators = useMemo(() => {
    if (!beforeReport || !afterReport) return [];

    return beforeReport.indicators.filter((bInd) => {
      const aInd = afterReport.indicators.find((a) => a.id === bInd.id) || bInd;

      const bVal = typeof bInd.score === 'number' ? bInd.score : -1;
      const aVal = typeof aInd.score === 'number' ? aInd.score : -1;

      // Filter by mode
      if (filterMode === 'improved') {
        const isUp = (bVal !== -1 && aVal > bVal) || (bVal === -1 && aVal !== -1);
        if (!isUp) return false;
      } else if (filterMode === 'suboptimal') {
        if (aVal === 2) return false;
      } else if (filterMode === 'optimal') {
        if (aVal !== 2) return false;
      }

      // Search query
      if (indicatorSearch.trim()) {
        const q = indicatorSearch.toLowerCase();
        const inName = bInd.name.toLowerCase().includes(q);
        const inEvB = (bInd.evidence || '').toLowerCase().includes(q);
        const inEvA = (aInd.evidence || '').toLowerCase().includes(q);
        return inName || inEvB || inEvA;
      }

      return true;
    });
  }, [beforeReport, afterReport, filterMode, indicatorSearch]);

  if (!beforeReport || !afterReport) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          <GitCompare className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">
          Belum Ada Dokumen Telaah untuk Dibandingkan
        </h2>
        <p className="text-xs text-slate-500">
          Lakukan telaah RPP minimal 1 dokumen terlebih dahulu untuk menggunakan fitur komparasi revisi.
        </p>
      </div>
    );
  }

  const currentTeacherName = activeTeacherGroup?.displayName || beforeReport.identity.teacherName || 'Guru Pengampu';
  const currentSchoolName = beforeReport.identity.school || afterReport.identity.school || 'Satuan Pendidikan';
  const currentSubject = beforeReport.identity.subject || afterReport.identity.subject || 'Mata Pelajaran';

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* 1. Header & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1.5">
            <GitCompare className="w-4 h-4" />
            <span>SUPERVISI &amp; PENJAMINAN MUTU AKADEMIK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Komparasi Hasil Telaah Sebelum &amp; Sesudah Revisi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluasi perbandingan kemajuan instrumen 22 Indikator Pembelajaran Mendalam pada RPP dengan pemilik yang sama.
          </p>
        </div>

        {/* Action Buttons: Print, Word, New Revision */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => printOrSaveComparisonReport(beforeReport, afterReport)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Cetak Berita Acara Komparasi"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Berita Acara</span>
          </button>

          <button
            type="button"
            onClick={() => downloadDocxComparisonReport(beforeReport, afterReport)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Unduh Berita Acara Word (.doc)"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Unduh Word (.doc)</span>
          </button>

          {onNavigateNewWithTeacher && (
            <button
              type="button"
              onClick={() => onNavigateNewWithTeacher(currentTeacherName, currentSchoolName, currentSubject)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Telaah Revisi Baru Guru Ini</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Teacher & Report Selector Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <label htmlFor="teacher-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                Pilih Pemilik RPP (Guru Yang Ditelaah)
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  id="teacher-select"
                  aria-label="Pilih Pemilik RPP (Guru Yang Ditelaah)"
                  value={selectedTeacherKey}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className="font-bold text-slate-900 bg-transparent text-sm sm:text-base cursor-pointer focus:outline-hidden hover:text-emerald-700"
                >
                  {teacherList.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.name} {t.school ? `(${t.school})` : ''} — {t.count} Dokumen Telaah
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mode switch */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Mode:</span>
            <button
              type="button"
              onClick={() => setCrossTeacherMode(false)}
              className={`px-3 py-1.5 font-bold rounded-xl transition-colors ${
                !crossTeacherMode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pemilik Sama (Rekomendasi)
            </button>
            <button
              type="button"
              onClick={() => setCrossTeacherMode(true)}
              className={`px-3 py-1.5 font-bold rounded-xl transition-colors ${
                crossTeacherMode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lintas Guru Bebas
            </button>
          </div>
        </div>

        {/* Notice if teacher only has 1 document */}
        {!crossTeacherMode && teacherReports.length === 1 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Guru <strong>{currentTeacherName}</strong> saat ini baru memiliki <strong>1 dokumen telaah</strong>. Anda dapat mengunggah revisinya sekarang atau beralih ke mode lintas guru.
              </span>
            </div>
            {onNavigateNewWithTeacher && (
              <button
                type="button"
                onClick={() =>
                  onNavigateNewWithTeacher(
                    currentTeacherName,
                    currentSchoolName,
                    currentSubject,
                    beforeReport.identity.teacherNip || teacherReports[0]?.identity?.teacherNip
                  )
                }
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
              >
                + Unggah &amp; Telaah Revisi
              </button>
            )}
          </div>
        )}

        {/* Dual Cards Grid: Sebelum vs Sesudah */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* KARTU KIRI: SEBELUM REVISI */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                DOKUMEN SEBELUM REVISI (DRAF AWAL)
              </span>
              <button
                type="button"
                onClick={() => onSelectReport(beforeReport)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Lihat Detail</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Select Document Before */}
            <div>
              <label htmlFor="before-doc-select" className="text-[10px] text-slate-600 block mb-1">Pilih Versi Dokumen Sebelum Revisi:</label>
              <select
                id="before-doc-select"
                aria-label="Pilih Versi Dokumen Sebelum Revisi"
                value={beforeReportId}
                onChange={(e) => setBeforeReportId(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {(crossTeacherMode ? reports : teacherReports).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.identity.reviewDate || r.identity.uploadDate} — {r.identity.title || r.fileName} (Nilai: {r.summary.finalScore.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>

            {/* Snapshot Metrics */}
            <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-600 block text-[10px]">Nilai Akhir:</span>
                <span className="text-xl font-black text-slate-800">
                  {beforeReport.summary.finalScore.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-600 ml-1.5">/ 100</span>
              </div>
              <div>
                <span className="text-slate-600 block text-[10px]">Predikat:</span>
                <span className="font-extrabold text-slate-700">
                  {beforeReport.summary.predicate}
                </span>
              </div>
              <div className="col-span-2 pt-1 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  Tanggal Telaah: <strong>{beforeReport.identity.reviewDate || beforeReport.identity.uploadDate || '-'}</strong>
                </span>
                {beforeReport.identity.teacherNip && (
                  <span className="text-[10px] font-mono text-slate-500">
                    NIP: {beforeReport.identity.teacherNip}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TOMBOL TUKAR (SWAP) TENGAH */}
          <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
            <button
              type="button"
              onClick={handleSwapReports}
              title="Tukar Posisi Sebelum &amp; Sesudah"
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* KARTU KANAN: SESUDAH REVISI */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider uppercase text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                DOKUMEN SESUDAH REVISI (TERBARU)
              </span>
              <button
                type="button"
                onClick={() => onSelectReport(afterReport)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Lihat Detail</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Select Document After */}
            <div>
              <label htmlFor="after-doc-select" className="text-[10px] text-slate-600 block mb-1">Pilih Versi Dokumen Sesudah Revisi:</label>
              <select
                id="after-doc-select"
                aria-label="Pilih Versi Dokumen Sesudah Revisi"
                value={afterReportId}
                onChange={(e) => setAfterReportId(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-white border border-emerald-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {(crossTeacherMode ? reports : teacherReports).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.identity.reviewDate || r.identity.uploadDate} — {r.identity.title || r.fileName} (Nilai: {r.summary.finalScore.toFixed(1)})
                  </option>
                ))}
              </select>
            </div>

            {/* Snapshot Metrics */}
            <div className="pt-2 border-t border-emerald-200/70 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-600 block text-[10px]">Nilai Akhir:</span>
                <span className="text-xl font-black text-emerald-700">
                  {afterReport.summary.finalScore.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-600 ml-1.5">/ 100</span>
              </div>
              <div>
                <span className="text-slate-600 block text-[10px]">Predikat:</span>
                <span className="font-extrabold text-emerald-700">
                  {afterReport.summary.predicate}
                </span>
              </div>
              <div className="col-span-2 pt-1 text-[11px] text-emerald-900 flex flex-wrap items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Tanggal Telaah: <strong>{afterReport.identity.reviewDate || afterReport.identity.uploadDate || '-'}</strong>
                </span>
                {afterReport.identity.teacherNip && (
                  <span className="text-[10px] font-mono text-emerald-700">
                    NIP: {afterReport.identity.teacherNip}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Executive Delta Banner */}
      {deltaMetrics && (
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Box 1: Delta Score */}
            <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">
                KENAIKAN NILAI MUTU (DELTA)
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight my-1.5 flex items-center justify-center md:justify-start gap-2">
                <span>
                  {deltaMetrics.delta >= 0 ? `+${deltaMetrics.delta.toFixed(2)}` : deltaMetrics.delta.toFixed(2)}
                </span>
                {deltaMetrics.delta > 0 && (
                  <TrendingUp className="w-8 h-8 text-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-300">
                Dari <strong>{deltaMetrics.beforeScore.toFixed(1)}</strong> ➔ <strong>{deltaMetrics.afterScore.toFixed(1)}</strong>
                {deltaMetrics.delta > 0 && ` (+${deltaMetrics.deltaPercent.toFixed(1)}%)`}
              </p>
            </div>

            {/* Box 2: Perubahan Predikat */}
            <div className="border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6 text-center md:text-left space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                PROGRES PREDIKAT
              </span>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-extrabold text-white">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                  {beforeReport.summary.predicate}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {afterReport.summary.predicate}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tindak Lanjut: <span className="text-sky-300">{afterReport.summary.followUpCategory}</span>
              </p>
            </div>

            {/* Box 3: Indikator Breakdown */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Meningkat</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">
                  +{deltaMetrics.improved}
                </div>
                <span className="text-[9px] text-emerald-400/80">Indikator Naik Skor</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Tetap Optimal</span>
                <div className="text-2xl font-black text-white mt-1">
                  {deltaMetrics.optimalBoth}
                </div>
                <span className="text-[9px] text-slate-400">Konsisten Skor 2</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Perlu Perhatian</span>
                <div className="text-2xl font-black text-amber-300 mt-1">
                  {22 - deltaMetrics.optimalBoth - deltaMetrics.improved}
                </div>
                <span className="text-[9px] text-amber-400/80">Belum Skor 2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls for Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Indikator (22)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('improved')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              filterMode === 'improved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Meningkat (+{deltaMetrics?.improved || 0})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('suboptimal')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              filterMode === 'suboptimal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Masih Perlu Perbaikan (&lt; 2)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('optimal')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              filterMode === 'optimal'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tetap Optimal ({deltaMetrics?.optimalBoth || 0})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari indikator / kata kunci..."
            value={indicatorSearch}
            onChange={(e) => setIndicatorSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 5. Detailed 22 Indicators Comparative Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Tabel Komparasi 22 Indikator Pembelajaran Mendalam
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {displayedIndicators.length} dari 22 indikator telaah
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-4 w-56">Nama Indikator</th>
                <th className="py-3 px-3 text-center w-28">Skor Sebelum</th>
                <th className="py-3 px-3 text-center w-28">Skor Sesudah</th>
                <th className="py-3 px-3 text-center w-36">Perubahan</th>
                <th className="py-3 px-4">Komparasi Temuan / Bukti Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedIndicators.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                    Tidak ada indikator yang sesuai dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                displayedIndicators.map((bInd) => {
                  const aInd = afterReport.indicators.find((a) => a.id === bInd.id) || bInd;

                  const bVal = typeof bInd.score === 'number' ? bInd.score : -1;
                  const aVal = typeof aInd.score === 'number' ? aInd.score : -1;

                  const isImproved = (bVal !== -1 && aVal > bVal) || (bVal === -1 && aVal !== -1);
                  const isRegressed = bVal !== -1 && aVal !== -1 && aVal < bVal;
                  const isConsistent2 = aVal === 2 && bVal === 2;

                  return (
                    <tr
                      key={bInd.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isImproved ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* No */}
                      <td className="py-3.5 px-3 text-center font-bold text-slate-900 align-top">
                        {bInd.id}
                      </td>

                      {/* Indikator Name */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-bold text-slate-900 block">{bInd.name}</span>
                        {bInd.isOptional && (
                          <span className="text-[10px] text-slate-600 block mt-0.5">
                            (Komponen Opsional)
                          </span>
                        )}
                      </td>

                      {/* Skor Sebelum */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                              bInd.score === 2
                                ? 'bg-emerald-100 text-emerald-800'
                                : bInd.score === 1
                                ? 'bg-amber-100 text-amber-800'
                                : bInd.score === 0
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {bInd.score}
                          </span>
                          <span className="text-[9px] text-slate-600 mt-1 leading-tight">
                            {bInd.status}
                          </span>
                        </div>
                      </td>

                      {/* Skor Sesudah */}
                      <td className="py-3.5 px-3 text-center align-top">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                              aInd.score === 2
                                ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/20'
                                : aInd.score === 1
                                ? 'bg-amber-100 text-amber-800'
                                : aInd.score === 0
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {aInd.score}
                          </span>
                          <span className="text-[9px] text-slate-600 mt-1 leading-tight">
                            {aInd.status}
                          </span>
                        </div>
                      </td>

                      {/* Trend Badge */}
                      <td className="py-3.5 px-3 text-center align-top">
                        {isImproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                              {bVal !== -1 ? `+${aVal - bVal} Meningkat` : 'Terpenuhi'}
                            </span>
                          </span>
                        ) : isRegressed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <span>▼ {aVal - bVal} Turun</span>
                          </span>
                        ) : isConsistent2 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-50 text-teal-800">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            <span>Tetap Optimal</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-600">
                            Tetap ({aInd.score})
                          </span>
                        )}
                      </td>

                      {/* Evidence Comparison Side-by-Side */}
                      <td className="py-3.5 px-4 leading-relaxed align-top space-y-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                          <span className="text-[10px] font-black uppercase text-slate-600 block mb-0.5">
                            Sebelum Revisi:
                          </span>
                          <p className="text-[11px] text-slate-700">
                            {purgeProfilPelajarPancasila(bInd.evidence) || 'Tidak ditemukan bukti yang mendukung dalam dokumen draf awal.'}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70">
                          <span className="text-[10px] font-black uppercase text-emerald-800 block mb-0.5">
                            Sesudah Revisi:
                          </span>
                          <p className="text-[11px] text-slate-800">
                            {purgeProfilPelajarPancasila(aInd.evidence) || 'Tidak ditemukan bukti yang mendukung dalam dokumen revisi.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Resolutions of Prior Issues & Strengths Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom 1: Status Penyelesaian Catatan Awal */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Resolusi Catatan Kritis &amp; Prioritas Revisi</span>
          </div>
          <p className="text-xs text-slate-500">
            Pemeriksaan apakah komponen yang sebelumnya menjadi prioritas perbaikan telah disempurnakan pada versi revisi.
          </p>

          <div className="space-y-2.5">
            {beforeReport.priorities && beforeReport.priorities.length > 0 ? (
              beforeReport.priorities.map((item, idx) => {
                const targetInd = afterReport.indicators.find((ind) => ind.name === item.indicatorName);
                const isFixed = targetInd ? targetInd.score === 2 : false;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      isFixed
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">
                        {item.indicatorName}
                      </span>
                      {isFixed ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Berhasil Diperbaiki
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Masih Perlu Perhatian
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong>Isu Awal:</strong> {item.issue}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">
                Dokumen awal tidak memiliki daftar isu prioritas khusus.
              </p>
            )}
          </div>
        </div>

        {/* Kolom 2: Penguatan Kekuatan Baru */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Kekuatan Baru pada Hasil Revisi</span>
          </div>
          <p className="text-xs text-slate-500">
            Aspek positif dan keunggulan pedagogis baru yang berhasil dibangun guru dalam dokumen pasca-revisi.
          </p>

          <div className="space-y-2.5">
            {afterReport.feedback?.strengths && afterReport.feedback.strengths.length > 0 ? (
              afterReport.feedback.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{purgeProfilPelajarPancasila(str)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                Kekuatan kurikuler telah dicantumkan pada laporan lengkap.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lembar Pengesahan Berita Acara Komparasi Revisi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
            BERITA ACARA &amp; PENGESAHAN SUPERVISI KOMPARASI REVISI
          </h2>
          <p className="text-xs text-slate-500">
            Penetapan validasi peningkatan mutu RPP / Modul Ajar Pembelajaran Mendalam
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
                Guru Mata Pelajaran / Pemilik RPP
              </span>
            </div>
            <div className="pt-10">
              <strong className="text-xs font-bold text-slate-900 block">
                {currentTeacherName || '( .................................................... )'}
              </strong>
              <span className="text-[11px] text-slate-600 font-mono block mt-0.5">
                NIP. {afterReport.identity.teacherNip || beforeReport.identity.teacherNip || '......................................................'}
              </span>
            </div>
          </div>

          {/* Penelaah / Asesor */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center flex flex-col justify-between min-h-[170px]">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {currentSchoolName ? currentSchoolName.split(' ')[0] : 'Kota'}, {afterReport.identity.reviewDate || new Date().toLocaleDateString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-slate-700 block mt-0.5">
                Penelaah / Asesor Supervisi Akademik
              </span>
            </div>
            <div className="pt-10">
              <strong className="text-xs font-bold text-slate-900 block">
                {afterReport.identity.reviewerName || beforeReport.identity.reviewerName || 'Tim Penelaah'}
              </strong>
              <span className="text-[11px] text-slate-600 font-mono block mt-0.5">
                NIP. {afterReport.identity.reviewerNip || beforeReport.identity.reviewerNip || '......................................................'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
