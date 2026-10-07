import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { INSTRUMENT_DEFINITIONS, OPTIONAL_INDICATOR_IDS } from '../data/instruments';

export const InstrumentGuideView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <ClipboardList className="w-3.5 h-3.5" />
          Pedoman Resmi Asesor &amp; Pengawas
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          INSTRUMEN TELAAH 22 INDIKATOR PEMBELAJARAN MENDALAM
        </h1>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Panduan teknis penskoran, kriteria rubrik kualitatif, serta integrasi 3 pilar Pembelajaran Mendalam (Mindful, Meaningful, Joyful).
        </p>
      </div>

      {/* Skala Penskoran & Rumus Perhitungan Nilai Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skala Penilaian */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Skala Penilaian Baku
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <strong className="text-emerald-900 font-bold block mb-1">
                2 – TERPENUHI SECARA OPTIMAL
              </strong>
              <p className="text-slate-700 leading-relaxed">
                Indikator tersedia lengkap, jelas, relevan, terintegrasi kontekstual, dan selaras dengan perencanaan pembelajaran.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <strong className="text-amber-900 font-bold block mb-1">
                1 – TERPENUHI SEBAGIAN / BELUM OPTIMAL
              </strong>
              <p className="text-slate-700 leading-relaxed">
                Indikator sudah ada, tetapi belum lengkap, belum jelas, belum konsisten, atau belum sepenuhnya selaras dengan tujuan/asesmen.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/80">
              <strong className="text-rose-900 font-bold block mb-1">
                0 – BELUM TERPENUHI
              </strong>
              <p className="text-slate-700 leading-relaxed">
                Indikator wajib belum ada, belum tergambar dalam alur langkah kegiatan, atau tidak sesuai dengan yang dipersyaratkan.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 font-bold block mb-1">
                N/A – TIDAK RELEVAN (Hanya untuk Komponen Opsional)
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Digunakan apabila indikator bersifat opsional (No. 2, 3, 10, 11, 22) dan memang tidak terdapat dalam naskah RPP. <strong>N/A tidak diperhitungkan dalam nilai akhir.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Rumus Nilai Akhir & Predikat */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Rumus &amp; Predikat Mutu
          </h2>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
            <span className="text-emerald-400 font-mono font-bold text-[11px] block">
              RUMUS NILAI AKHIR:
            </span>
            <div className="font-mono text-sm font-black text-amber-300">
              Nilai Akhir = (Total Skor / Skor Maksimal Indikator Dinilai) × 100
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Skor Maksimal = Jumlah indikator dinilai × 2. Indikator N/A dikeluarkan dari penyebut maupun pembilang sehingga penilaian adil dan proporsional.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-900">86 – 100 : SANGAT BAIK</span>
              <span className="text-emerald-700 font-semibold">Penyempurnaan Minor</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 border border-sky-200">
              <span className="font-bold text-sky-900">76 – 85 : BAIK</span>
              <span className="text-sky-700 font-semibold">Revisi Terbatas</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900">66 – 75 : CUKUP</span>
              <span className="text-amber-700 font-semibold">Revisi Terarah</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-900">≤ 65 : PERLU PERBAIKAN</span>
              <span className="text-rose-700 font-semibold">Revisi Mendasar</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Indikator Opsional Banner */}
      <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 space-y-3">
        <h2 className="text-sm font-bold text-amber-950 uppercase tracking-tight flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          Aturan Khusus 5 Indikator Bersifat Opsional
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          Terdapat tepat 5 indikator yang bersifat <strong>OPSIONAL</strong>:{' '}
          <strong>No. 2 (Identifikasi Murid)</strong>, <strong>No. 3 (Materi Pelajaran)</strong>,{' '}
          <strong>No. 10 (Kemitraan Pembelajaran)</strong>, <strong>No. 11 (Pemanfaatan Digital)</strong>, dan{' '}
          <strong>No. 22 (Lembar Kerja Murid)</strong>.
        </p>
        <div className="p-3 bg-white rounded-2xl border border-amber-200/80 text-xs text-slate-700 space-y-1">
          <p>
            • Jika komponen <strong>ADA</strong> dicantumkan guru: nilai kualitasnya dengan skor 0, 1, atau 2.
          </p>
          <p>
            • Jika komponen <strong>TIDAK ADA</strong> dicantumkan: wajib diberi nilai <strong>N/A</strong> dan tidak mengurangi skor akhir guru.
          </p>
          <p>
            • Khusus <strong>Indikator 11 (Digital)</strong>: jangan beri skor 2 hanya karena ada proyektor/laptop; harus interaktif dan kolaboratif.
          </p>
          <p>
            • Khusus <strong>Indikator 22 (LKPD)</strong>: jika tidak menyertakan lembar kerja = N/A. Jika ada tapi tidak selaras = 1 atau 0. Jika selaras = 2.
          </p>
        </div>
      </div>

      {/* 22 Indicators Accordion / List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Daftar Rinci 22 Indikator &amp; Rubrik Kriteria
        </h2>
        <p className="text-xs text-slate-500">
          Klik pada indikator untuk melihat daftar periksa dan deskriptor rubrik penskoran
        </p>

        <div className="space-y-3 pt-2">
          {INSTRUMENT_DEFINITIONS.map((def) => {
            const isExpanded = expandedId === def.id;

            return (
              <div
                key={def.id}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-slate-300"
              >
                <div
                  onClick={() => toggleExpand(def.id)}
                  className="p-4 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {def.id}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                        {def.name}
                        {def.isOptional && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Opsional
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{def.description}</p>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 bg-white border-t border-slate-100 space-y-4 text-xs animate-in slide-in-from-top-1 duration-200">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1.5 uppercase text-[10px] tracking-wider">
                        Aspek yang Diperiksa:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {def.checklist.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px]"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                        Deskriptor Penskoran:
                      </span>

                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <strong className="text-emerald-900 font-bold block mb-0.5">Skor 2 (Optimal):</strong>
                        <p className="text-slate-700">{def.rubric2}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                        <strong className="text-amber-900 font-bold block mb-0.5">Skor 1 (Sebagian):</strong>
                        <p className="text-slate-700">{def.rubric1}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                        <strong className="text-rose-900 font-bold block mb-0.5">Skor 0 (Belum Ada):</strong>
                        <p className="text-slate-700">{def.rubric0}</p>
                      </div>

                      {def.rubricNA && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <strong className="text-slate-700 font-bold block mb-0.5">Skor N/A:</strong>
                          <p className="text-slate-600">{def.rubricNA}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
