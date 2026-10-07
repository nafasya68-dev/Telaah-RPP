import React from 'react';
import {
  FileText,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
  Eye,
  Edit3,
  Download,
  Trash2,
  Sparkles,
  BarChart3,
  Calendar,
  User,
  GraduationCap,
  GitCompare,
} from 'lucide-react';
import { AnalysisReport, PredicateType } from '../types/telaah';
import { INSTRUMENT_DEFINITIONS } from '../data/instruments';

interface DashboardViewProps {
  reports: AnalysisReport[];
  onNavigateNew: () => void;
  onSelectReport: (report: AnalysisReport) => void;
  onEditReport: (report: AnalysisReport) => void;
  onDownloadReport: (report: AnalysisReport) => void;
  onDeleteReport: (report: AnalysisReport) => void;
  onOpenComparison?: (teacherName?: string, reportId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onNavigateNew,
  onSelectReport,
  onEditReport,
  onDownloadReport,
  onDeleteReport,
  onOpenComparison,
}) => {
  // Statistics Calculations
  const totalReports = reports.length;
  const avgScore =
    totalReports > 0
      ? (reports.reduce((acc, r) => acc + r.summary.finalScore, 0) / totalReports).toFixed(1)
      : '0.0';

  const predicateCounts: Record<PredicateType, number> = {
    'SANGAT BAIK': 0,
    'BAIK': 0,
    'CUKUP': 0,
    'PERLU PERBAIKAN': 0,
  };

  let totalScore2 = 0;
  let totalScore1 = 0;
  let totalScore0 = 0;
  let totalNa = 0;

  reports.forEach((r) => {
    if (predicateCounts[r.summary.predicate] !== undefined) {
      predicateCounts[r.summary.predicate]++;
    }
    totalScore2 += r.summary.scoreCounts.score2;
    totalScore1 += r.summary.scoreCounts.score1;
    totalScore0 += r.summary.scoreCounts.score0;
    totalNa += r.summary.scoreCounts.na;
  });

  const totalAllScoresCount = totalScore2 + totalScore1 + totalScore0 + totalNa;

  // Calculate average score per indicator across all reports
  const indicatorAverages = INSTRUMENT_DEFINITIONS.map((def) => {
    let scoreSum = 0;
    let evalCount = 0;
    reports.forEach((r) => {
      const ind = r.indicators.find((i) => i.id === def.id);
      if (ind && ind.score !== 'N/A') {
        scoreSum += Number(ind.score);
        evalCount++;
      }
    });
    const avg = evalCount > 0 ? scoreSum / evalCount : 0;
    return {
      id: def.id,
      name: def.name,
      avg: Number(avg.toFixed(2)),
      evalCount,
      isOptional: def.isOptional,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Telaah Cerdas Pembelajaran Mendalam
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Dashboard Telaah Perencanaan Pembelajaran
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Analisis objektif dan komprehensif terhadap 22 indikator RPP/Modul Ajar berprinsip Berkesadaran (Mindful), Bermakna (Meaningful), dan Menggembirakan (Joyful).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenComparison && (
              <button
                type="button"
                onClick={() => onOpenComparison()}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold text-emerald-300 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
                title="Bandingkan Hasil Telaah Sebelum dan Sesudah Revisi"
              >
                <GitCompare className="w-4 h-4" />
                <span>Komparasi Revisi</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateNew}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ TELAAH RPP / MODUL AJAR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total RPP */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total RPP</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalReports}</div>
          <p className="text-[11px] text-slate-500 mt-1">Modul Ajar ditelaah</p>
        </div>

        {/* Rata-rata Nilai */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-rata Nilai</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{avgScore}</div>
          <p className="text-[11px] text-slate-500 mt-1">Skala 100 poin</p>
        </div>

        {/* Sangat Baik */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 bg-emerald-50/20 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sangat Baik</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">
            {predicateCounts['SANGAT BAIK']}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Nilai 86 – 100</p>
        </div>

        {/* Baik */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-200/80 bg-sky-50/20 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-sky-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Baik</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-800">
            {predicateCounts['BAIK']}
          </div>
          <p className="text-[11px] text-sky-600 mt-1">Nilai 76 – 85</p>
        </div>

        {/* Cukup */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 bg-amber-50/20 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cukup</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800">
            {predicateCounts['CUKUP']}
          </div>
          <p className="text-[11px] text-amber-600 mt-1">Nilai 66 – 75</p>
        </div>

        {/* Perlu Perbaikan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 bg-rose-50/20 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Perlu Perbaikan</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-800">
            {predicateCounts['PERLU PERBAIKAN']}
          </div>
          <p className="text-[11px] text-rose-600 mt-1">Nilai ≤ 65</p>
        </div>
      </div>

      {/* Feature Showcase: Komparasi Sebelum & Sesudah Revisi RPP */}
      {onOpenComparison && (
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden animate-in fade-in">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <GitCompare className="w-3.5 h-3.5" />
                <span>Fitur Baru: Supervisi Mutu Berkelanjutan</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Komparasi Hasil Telaah Sebelum &amp; Sesudah Revisi RPP
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Bandingkan kemajuan penilaian 22 indikator Pembelajaran Mendalam pada RPP dengan guru yang sama (misal: draf awal vs. hasil revisi siklus supervisi). Tersedia data telaah guru <strong>RIFA’ATUL MAHMUDAH, S.Pd. (SMA Al HASRA)</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenComparison('RIFA’ATUL MAHMUDAH, S.Pd.')}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Buka Komparasi Guru Rifa'atul</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenComparison()}
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
              >
                <GitCompare className="w-4 h-4" />
                <span>Semua Guru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Distribusi Predikat */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Distribusi Predikat
              </h2>
              <p className="text-xs text-slate-500">Persentase capaian modul ajar</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {(
              [
                { label: 'Sangat Baik', key: 'SANGAT BAIK', color: 'bg-emerald-500', text: 'text-emerald-700' },
                { label: 'Baik', key: 'BAIK', color: 'bg-sky-500', text: 'text-sky-700' },
                { label: 'Cukup', key: 'CUKUP', color: 'bg-amber-500', text: 'text-amber-700' },
                { label: 'Perlu Perbaikan', key: 'PERLU PERBAIKAN', color: 'bg-rose-500', text: 'text-rose-700' },
              ] as const
            ).map((item) => {
              const count = predicateCounts[item.key];
              const pct = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;
              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.label}</span>
                    <span className={item.text}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Komposisi Skor 0, 1, 2, dan N/A */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Komposisi Skor Indikator
              </h2>
              <p className="text-xs text-slate-500">Skor 2, 1, 0, dan N/A akumulatif</p>
            </div>
            <Award className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Skor 2 (Optimal)</span>
              <div className="text-2xl font-black text-emerald-700">{totalScore2}</div>
              <p className="text-[10px] text-emerald-600">
                {totalAllScoresCount > 0 ? Math.round((totalScore2 / totalAllScoresCount) * 100) : 0}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Skor 1 (Sebagian)</span>
              <div className="text-2xl font-black text-amber-700">{totalScore1}</div>
              <p className="text-[10px] text-amber-600">
                {totalAllScoresCount > 0 ? Math.round((totalScore1 / totalAllScoresCount) * 100) : 0}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
              <span className="text-[10px] font-bold text-rose-800 uppercase">Skor 0 (Belum Ada)</span>
              <div className="text-2xl font-black text-rose-700">{totalScore0}</div>
              <p className="text-[10px] text-rose-600">
                {totalAllScoresCount > 0 ? Math.round((totalScore0 / totalAllScoresCount) * 100) : 0}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-700 uppercase">N/A (Opsional)</span>
              <div className="text-2xl font-black text-slate-600">{totalNa}</div>
              <p className="text-[10px] text-slate-500">
                {totalAllScoresCount > 0 ? Math.round((totalNa / totalAllScoresCount) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
            {totalAllScoresCount > 0 && (
              <>
                <div
                  style={{ width: `${(totalScore2 / totalAllScoresCount) * 100}%` }}
                  className="bg-emerald-500 h-full"
                  title="Skor 2"
                />
                <div
                  style={{ width: `${(totalScore1 / totalAllScoresCount) * 100}%` }}
                  className="bg-amber-500 h-full"
                  title="Skor 1"
                />
                <div
                  style={{ width: `${(totalScore0 / totalAllScoresCount) * 100}%` }}
                  className="bg-rose-500 h-full"
                  title="Skor 0"
                />
                <div
                  style={{ width: `${(totalNa / totalAllScoresCount) * 100}%` }}
                  className="bg-slate-400 h-full"
                  title="Skor N/A"
                />
              </>
            )}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Optimal (2)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Sebagian (1)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Kurang (0)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> N/A</span>
          </div>
        </div>

        {/* Chart 3: Skor Rata-rata Indikator Inti */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Fokus Pilar Deep Learning
              </h2>
              <p className="text-xs text-slate-500">Ketercapaian pengalaman belajar mendalam</p>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {[
              { id: 12, title: '12. Memahami (Eksplorasi & Koneksi)' },
              { id: 13, title: '13. Mengaplikasi (Konteks Nyata & Inovasi)' },
              { id: 14, title: '14. Merefleksi (Metakognisi & Tindak Lanjut)' },
              { id: 15, title: '15. Saling Memuliakan (Inklusif & Etika)' },
              { id: 16, title: '16. Prinsip Mindful, Meaningful, Joyful' },
            ].map((pilar) => {
              const ind = indicatorAverages.find((i) => i.id === pilar.id);
              const val = ind ? ind.avg : 0;
              const pct = (val / 2) * 100;
              const barColor = val >= 1.6 ? 'bg-emerald-500' : val >= 1.0 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <div key={pilar.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate pr-2">{pilar.title}</span>
                    <span className="font-bold text-slate-900">{val.toFixed(2)} / 2</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RPP / Modul Ajar Ditelaah Terbaru */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              RPP / Modul Ajar Terbaru yang Ditelaah
            </h2>
            <p className="text-xs text-slate-500">
              Daftar dokumen kurikulum dengan nilai, predikat, dan tindak lanjut supervisi
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateNew}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Telaah Dokumen Lain
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Dokumen Ditelaah</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Mulai telaah RPP atau Modul Ajar pertama Anda dalam format PDF atau DOCX dengan instrumen 22 indikator otomatis.
            </p>
            <button
              type="button"
              onClick={onNavigateNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Mulai Telaah Sekarang
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((report) => {
              const { identity, summary } = report;
              const predColor =
                summary.predicate === 'SANGAT BAIK'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : summary.predicate === 'BAIK'
                  ? 'bg-sky-100 text-sky-800 border-sky-200'
                  : summary.predicate === 'CUKUP'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <div
                  key={report.id}
                  className="py-4 sm:py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl px-2 sm:px-3 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${predColor}`}>
                        {summary.predicate}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {identity.gradePhase || 'Fase/Kelas -'}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {identity.reviewDate || new Date(report.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectReport(report)}
                      className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors truncate"
                    >
                      {identity.title || report.fileName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {identity.teacherName || 'Guru Pengampu'}
                        {identity.teacherNip && (
                          <span className="text-[10px] font-mono text-slate-500 font-normal">
                            (NIP: {identity.teacherNip})
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {identity.school || 'Satuan Pendidikan'}
                      </span>
                      <span>Mapel: <strong className="text-slate-700">{identity.subject || '-'}</strong></span>
                    </div>
                  </div>

                  {/* Score & Action Buttons */}
                  <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right pr-2">
                      <div className="text-xl font-black text-slate-900 leading-none">
                        {summary.finalScore.toFixed(2)}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">
                        Tindak lanjut: <strong className="text-slate-700">{summary.followUpCategory}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectReport(report)}
                        title="Lihat Detail Telaah"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {onOpenComparison && (
                        <button
                          type="button"
                          onClick={() => onOpenComparison(identity.teacherName, report.id)}
                          title="Bandingkan Revisi RPP Guru Ini"
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          <GitCompare className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEditReport(report)}
                        title="Edit Penilaian Manual"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownloadReport(report)}
                        title="Unduh Laporan"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-800 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteReport(report)}
                        title="Hapus RPP & Hasil Telaah"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
