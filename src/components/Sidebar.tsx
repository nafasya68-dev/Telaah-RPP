import React from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  FileCheck2,
  GitCompare,
  History,
  ClipboardList,
  Settings,
  PlusCircle,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'new' | 'detail' | 'comparison' | 'history' | 'instrument' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  reportCount: number;
  hasActiveReport: boolean;
  hasRevisionsAvailable?: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  reportCount,
  hasActiveReport,
  hasRevisionsAvailable,
  isOpenMobile,
  onCloseMobile,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; disabled?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new', label: 'Telaah Baru', icon: FilePlus2 },
    {
      id: 'detail',
      label: 'Hasil Telaah',
      icon: FileCheck2,
      badge: hasActiveReport ? 'Aktif' : undefined,
    },
    {
      id: 'comparison',
      label: 'Komparasi Revisi',
      icon: GitCompare,
      badge: hasRevisionsAvailable ? 'Tersedia' : undefined,
    },
    { id: 'history', label: 'Riwayat', icon: History, badge: reportCount },
    { id: 'instrument', label: 'Instrumen 22 Indikator', icon: ClipboardList },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Main Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Brand Mobile view */}
          <div className="flex items-center gap-3 px-2 md:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
                TELAAH RPP / MODUL AJAR
              </h2>
              <p className="text-[11px] text-emerald-400 font-medium">Pembelajaran Mendalam</p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 md:pt-4">
            <button
              type="button"
              onClick={() => {
                onSelectTab('new');
                onCloseMobile();
              }}
              className="w-full group relative flex items-center justify-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-98"
            >
              <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
              <span>+ TELAAH RPP / MODUL AJAR</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Menu Utama
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/90 text-white shadow-md shadow-emerald-700/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner: Filosofi Pembelajaran Mendalam */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>3 Pilar Deep Learning</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Berkesadaran</strong> (Mindful),{' '}
              <strong className="text-slate-200">Bermakna</strong> (Meaningful), &amp;{' '}
              <strong className="text-slate-200">Menggembirakan</strong> (Joyful).
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
