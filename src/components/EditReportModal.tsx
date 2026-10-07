import React, { useState } from 'react';
import { X, Save, RotateCcw, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { AnalysisReport, IndicatorResult, ScoreType } from '../types/telaah';
import { calculateSummary, buildPriorities, buildIncompatibilities, generateFeedback, generateReviewDescription } from '../data/instruments';
import { toIsoDate, formatIndonesianDate } from '../utils/date';
import { purgeProfilPelajarPancasila } from '../utils/textPurge';

interface EditReportModalProps {
  isOpen: boolean;
  report: AnalysisReport;
  onClose: () => void;
  onSave: (updatedReport: AnalysisReport) => void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  report,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // Identity Form State
  const [identity, setIdentity] = useState({ ...report.identity });

  // Indicators State
  const [indicators, setIndicators] = useState<IndicatorResult[]>(
    JSON.parse(JSON.stringify(report.indicators))
  );

  // Active Tab in Modal: Identitas vs 22 Indikator vs Umpan Balik
  const [modalTab, setModalTab] = useState<'identity' | 'indicators' | 'feedback'>('indicators');

  // Feedback State
  const [feedback, setFeedback] = useState({ ...report.feedback });
  const [reviewDescription, setReviewDescription] = useState(report.reviewDescription);

  // Dynamic live calculations
  const liveSummary = calculateSummary(indicators);

  const handleScoreChange = (id: number, newScore: ScoreType) => {
    setIndicators((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let status = item.status;
          if (newScore === 2) status = 'Terpenuhi Optimal';
          else if (newScore === 1) status = 'Terpenuhi Sebagian';
          else if (newScore === 0) status = 'Belum Terpenuhi';
          else if (newScore === 'N/A') status = 'N/A';

          return {
            ...item,
            score: newScore,
            status,
          };
        }
        return item;
      })
    );
  };

  const handleFieldChange = (id: number, field: 'evidence' | 'criticalComment' | 'recommendation', value: string) => {
    setIndicators((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    const sanitizedIndicators = indicators.map((ind) => ({
      ...ind,
      evidence: purgeProfilPelajarPancasila(ind.evidence),
      criticalComment: purgeProfilPelajarPancasila(ind.criticalComment),
      recommendation: purgeProfilPelajarPancasila(ind.recommendation),
    }));

    const recalculatedSummary = calculateSummary(sanitizedIndicators);
    const newPriorities = buildPriorities(sanitizedIndicators);
    const newIncompatibilities = buildIncompatibilities(sanitizedIndicators);

    const updatedFeedback = {
      strengths: (feedback.strengths || []).map(purgeProfilPelajarPancasila),
      improvements: (feedback.improvements || []).map(purgeProfilPelajarPancasila),
      practicalRecommendations: (feedback.practicalRecommendations || []).map(purgeProfilPelajarPancasila),
      followUpSteps: (feedback.followUpSteps || []).map(purgeProfilPelajarPancasila),
    };

    const updated: AnalysisReport = {
      ...report,
      updatedAt: new Date().toISOString(),
      identity,
      indicators: sanitizedIndicators,
      summary: recalculatedSummary,
      priorities: newPriorities,
      incompatibleComponents: newIncompatibilities,
      feedback: updatedFeedback,
      reviewDescription: purgeProfilPelajarPancasila(reviewDescription || generateReviewDescription(recalculatedSummary, sanitizedIndicators)),
    };

    onSave(updated);
    onClose();
  };

  const handleRegenerateText = () => {
    const updatedFeedback = generateFeedback(indicators, liveSummary);
    const updatedDesc = generateReviewDescription(liveSummary, indicators);
    setFeedback(updatedFeedback);
    setReviewDescription(updatedDesc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Edit Manual Hasil Telaah RPP / Modul Ajar
              </h2>
              <p className="text-xs text-slate-500">
                Nilai akhir, predikat, dan tindak lanjut dihitung ulang otomatis secara real-time
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Score Strip */}
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-4">
            <span>
              Nilai Akhir: <strong className="text-emerald-400 text-base">{liveSummary.finalScore.toFixed(2)}</strong>
            </span>
            <span>
              Predikat: <strong className="text-sky-300">{liveSummary.predicate}</strong>
            </span>
            <span>
              Tindak Lanjut: <strong className="text-amber-300">{liveSummary.followUpCategory}</strong>
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Dinilai: {liveSummary.evaluatedCount} | N/A: {liveSummary.naCount} | Skor: {liveSummary.totalScore}/{liveSummary.maxPossibleScore}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setModalTab('indicators')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              modalTab === 'indicators'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            22 Indikator &amp; Skor
          </button>
          <button
            type="button"
            onClick={() => setModalTab('identity')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              modalTab === 'identity'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Identitas Dokumen
          </button>
          <button
            type="button"
            onClick={() => setModalTab('feedback')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              modalTab === 'feedback'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Deskripsi &amp; Umpan Balik
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 22 INDICATORS */}
          {modalTab === 'indicators' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Petunjuk Penskoran:</strong> Gunakan <strong>2</strong> (Optimal), <strong>1</strong> (Sebagian), <strong>0</strong> (Belum Terpenuhi). Untuk indikator opsional (No 2, 3, 10, 11, 22), jika tidak ada dalam dokumen pilih <strong>N/A</strong> (tidak masuk hitungan nilai).
                </span>
              </div>

              <div className="space-y-4">
                {indicators.map((ind) => (
                  <div
                    key={ind.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-black text-slate-800 text-sm">
                          {ind.id}. {ind.name}
                        </span>
                        {ind.isOptional && (
                          <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            Opsional
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-700">Skor:</label>
                        <select
                          value={ind.score}
                          onChange={(e) => {
                            const val = e.target.value === 'N/A' ? 'N/A' : (Number(e.target.value) as ScoreType);
                            handleScoreChange(ind.id, val);
                          }}
                          className={`text-xs font-black px-3 py-1.5 rounded-xl border ${
                            ind.score === 2
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : ind.score === 1
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : ind.score === 0
                              ? 'bg-rose-50 border-rose-300 text-rose-800'
                              : 'bg-slate-100 border-slate-300 text-slate-700'
                          }`}
                        >
                          <option value={2}>2 – Terpenuhi Optimal</option>
                          <option value={1}>1 – Terpenuhi Sebagian</option>
                          <option value={0}>0 – Belum Terpenuhi</option>
                          {ind.isOptional && <option value="N/A">N/A – Tidak Relevan</option>}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Bukti Dokumen:</label>
                        <textarea
                          rows={2}
                          value={ind.evidence}
                          onChange={(e) => handleFieldChange(ind.id, 'evidence', e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          placeholder="Bukti temuan dalam dokumen..."
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Komentar Kritis:</label>
                        <textarea
                          rows={2}
                          value={ind.criticalComment}
                          onChange={(e) => handleFieldChange(ind.id, 'criticalComment', e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          placeholder="Komentar kritis..."
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Rekomendasi:</label>
                        <textarea
                          rows={2}
                          value={ind.recommendation}
                          onChange={(e) => handleFieldChange(ind.id, 'recommendation', e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                          placeholder="Rekomendasi perbaikan..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITY */}
          {modalTab === 'identity' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Dokumen / RPP</label>
                <input
                  type="text"
                  value={identity.title}
                  onChange={(e) => setIdentity({ ...identity, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Guru</label>
                <input
                  type="text"
                  value={identity.teacherName}
                  onChange={(e) => setIdentity({ ...identity, teacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP Guru / Penyusun</label>
                <input
                  type="text"
                  value={identity.teacherNip || ''}
                  onChange={(e) => setIdentity({ ...identity, teacherNip: e.target.value })}
                  placeholder="Contoh: 19850314 201001 1 015"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Satuan Pendidikan (Sekolah / Madrasah)</label>
                <input
                  type="text"
                  value={identity.school}
                  onChange={(e) => setIdentity({ ...identity, school: e.target.value })}
                  placeholder="Contoh: SMA Negeri 1 / MTs Negeri 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={identity.subject}
                  onChange={(e) => setIdentity({ ...identity, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fase / Kelas</label>
                <input
                  type="text"
                  value={identity.gradePhase}
                  onChange={(e) => setIdentity({ ...identity, gradePhase: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Materi Pokok</label>
                <input
                  type="text"
                  value={identity.topic}
                  onChange={(e) => setIdentity({ ...identity, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alokasi Waktu</label>
                <input
                  type="text"
                  value={identity.timeAllocation}
                  onChange={(e) => setIdentity({ ...identity, timeAllocation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Penelaah / Asesor</label>
                <input
                  type="text"
                  value={identity.reviewerName}
                  onChange={(e) => setIdentity({ ...identity, reviewerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP Penelaah / Asesor</label>
                <input
                  type="text"
                  value={identity.reviewerNip || ''}
                  onChange={(e) => setIdentity({ ...identity, reviewerNip: e.target.value })}
                  placeholder="Contoh: 19750812 200003 1 004"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Tanggal Telaah
                </label>
                <input
                  type="date"
                  value={toIsoDate(identity.reviewDate || identity.uploadDate)}
                  onChange={(e) => {
                    const formatted = formatIndonesianDate(e.target.value);
                    setIdentity({ ...identity, reviewDate: formatted, uploadDate: formatted });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl cursor-pointer bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FEEDBACK & DESKRIPSI */}
          {modalTab === 'feedback' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Narasi dan Rekomendasi</span>
                <button
                  type="button"
                  onClick={handleRegenerateText}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Sinkronkan Narasi Berdasarkan Skor Saat Ini
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Hasil Telaah</label>
                <textarea
                  rows={4}
                  value={reviewDescription}
                  onChange={(e) => setReviewDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-emerald-800 block mb-1">Kekuatan Utama (Pisahkan dengan baris baru)</label>
                  <textarea
                    rows={4}
                    value={feedback.strengths.join('\n')}
                    onChange={(e) => setFeedback({ ...feedback, strengths: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-bold text-rose-800 block mb-1">Hal yang Perlu Ditingkatkan</label>
                  <textarea
                    rows={4}
                    value={feedback.improvements.join('\n')}
                    onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-bold text-sky-800 block mb-1">Rekomendasi Praktis</label>
                  <textarea
                    rows={4}
                    value={feedback.practicalRecommendations.join('\n')}
                    onChange={(e) => setFeedback({ ...feedback, practicalRecommendations: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-bold text-teal-800 block mb-1">Tindak Lanjut Supervisi</label>
                  <textarea
                    rows={4}
                    value={feedback.followUpSteps.join('\n')}
                    onChange={(e) => setFeedback({ ...feedback, followUpSteps: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full p-3 border border-slate-300 rounded-xl leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Perubahan akan memperbarui riwayat dan laporan unduhan.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Simpan &amp; Perbarui Nilai Akhir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
