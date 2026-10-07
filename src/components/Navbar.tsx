import React from 'react';
import { BookOpenCheck, Sparkles, Menu, PlusCircle, UserCheck, GitCompare, HardDrive } from 'lucide-react';
import { AppSettings } from '../utils/storage';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigateNewReview: () => void;
  onNavigateComparison?: () => void;
  settings: AppSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onNavigateNewReview,
  onNavigateComparison,
  settings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                    Dashboard Telaah RPP / Modul Ajar
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Sparkles className="w-2.5 h-2.5" /> Pembelajaran Mendalam
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Instrumen Supervisi 22 Indikator Standar Kurikulum Nasional
                </p>
              </div>
            </div>
          </div>

          {/* Right: Reviewer Badge & Primary Action */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700" title="Semua data tersimpan privat di Local Storage perangkat Anda">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              <span>Local Storage</span>
            </div>

            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">
                  {settings.defaultReviewerName || 'Penelaah Kurikulum'}
                </p>
                <p className="text-[10px] text-slate-500 leading-none mt-1">
                  Asesor / Pengawas Sekolah
                </p>
              </div>
            </div>

            {onNavigateComparison && (
              <button
                type="button"
                onClick={onNavigateComparison}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-xs"
                title="Buka Komparasi Revisi RPP"
              >
                <GitCompare className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Komparasi Revisi</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateNewReview}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">+ TELAAH RPP / MODUL AJAR</span>
              <span className="sm:hidden">Telaah Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
