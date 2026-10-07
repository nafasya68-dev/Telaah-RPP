import React, { useState, useEffect } from 'react';
import {
  getStoredReports,
  getRecycleBinReports,
  saveSingleReport,
  softDeleteReport,
  restoreReport,
  permanentDeleteReport,
  clearAllActiveReports,
  clearRecycleBin,
  getAppSettings,
  AppSettings,
} from './utils/storage';
import { AnalysisReport } from './types/telaah';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { ReportDetailView } from './components/ReportDetailView';
import { HistoryView } from './components/HistoryView';
import { InstrumentGuideView } from './components/InstrumentGuideView';
import { SettingsView } from './components/SettingsView';
import { ComparisonView } from './components/ComparisonView';
import { EditReportModal } from './components/EditReportModal';
import { printOrSavePdfReport, downloadDocxReport } from './utils/export';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [recycleBinReports, setRecycleBinReports] = useState<AnalysisReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Comparison State
  const [comparisonTeacherName, setComparisonTeacherName] = useState<string | undefined>();
  const [comparisonBeforeReportId, setComparisonBeforeReportId] = useState<string | undefined>();
  const [comparisonAfterReportId, setComparisonAfterReportId] = useState<string | undefined>();
  const [preFillTeacherInfo, setPreFillTeacherInfo] = useState<{
    teacherName: string;
    schoolName: string;
    subject: string;
    teacherNip?: string;
    reviewerNip?: string;
  } | null>(null);

  // Check if any teacher has 2+ reports
  const hasRevisionsAvailable = React.useMemo(() => {
    const counts = new Map<string, number>();
    reports.forEach((r) => {
      const name = (r.identity?.teacherName || '').trim().toLowerCase();
      if (name) counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.values()).some((cnt) => cnt >= 2);
  }, [reports]);

  // Open comparison view with optional teacher and report focus
  const handleOpenComparison = (teacherName?: string, beforeId?: string, afterId?: string) => {
    setComparisonTeacherName(teacherName);
    setComparisonBeforeReportId(beforeId);
    setComparisonAfterReportId(afterId);
    setCurrentTab('comparison');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to new analysis with pre-filled teacher info for revision review
  const handleNavigateNewWithTeacher = (teacherName: string, schoolName: string, subject: string, teacherNip?: string) => {
    setPreFillTeacherInfo({ teacherName, schoolName, subject, teacherNip });
    setCurrentTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize data from storage
  const reloadData = () => {
    const stored = getStoredReports();
    setReports(stored);
    const recycled = getRecycleBinReports();
    setRecycleBinReports(recycled);

    if (!selectedReport && stored.length > 0) {
      setSelectedReport(stored[0]);
    } else if (selectedReport) {
      const match = stored.find((r) => r.id === selectedReport.id);
      if (match) setSelectedReport(match);
      else setSelectedReport(stored.length > 0 ? stored[0] : null);
    } else if (stored.length === 0) {
      setSelectedReport(null);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // When a new analysis finishes
  const handleAnalysisSuccess = (newReport: AnalysisReport) => {
    saveSingleReport(newReport);
    setSelectedReport(newReport);
    reloadData();
    setCurrentTab('detail');
  };

  // Select an existing report to view
  const handleSelectReport = (report: AnalysisReport) => {
    setSelectedReport(report);
    setCurrentTab('detail');
  };

  // Open edit modal directly
  const handleEditReport = (report: AnalysisReport) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  // Update report
  const handleUpdateReport = (updated: AnalysisReport) => {
    saveSingleReport(updated);
    setSelectedReport(updated);
    reloadData();
  };

  // Soft Delete
  const handleSoftDelete = (reportId: string) => {
    softDeleteReport(reportId);
    reloadData();
    if (selectedReport?.id === reportId) {
      const remaining = reports.filter((r) => r.id !== reportId);
      setSelectedReport(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Restore from Recycle Bin
  const handleRestore = (reportId: string) => {
    restoreReport(reportId);
    reloadData();
  };

  // Permanent Delete
  const handlePermanentDelete = (reportId: string) => {
    permanentDeleteReport(reportId);
    reloadData();
  };

  // Clear all active
  const handleClearAllActive = () => {
    clearAllActiveReports();
    reloadData();
    setSelectedReport(null);
  };

  // Clear recycle bin
  const handleClearTrash = () => {
    clearRecycleBin();
    reloadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        reportCount={reports.length}
        hasActiveReport={Boolean(selectedReport)}
        hasRevisionsAvailable={hasRevisionsAvailable}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onNavigateNewReview={() => {
            setCurrentTab('new');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateComparison={() => handleOpenComparison()}
          settings={settings}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <DashboardView
              reports={reports}
              onNavigateNew={() => setCurrentTab('new')}
              onSelectReport={handleSelectReport}
              onEditReport={handleEditReport}
              onDownloadReport={(r) => downloadDocxReport(r)}
              onDeleteReport={(r) => handleSoftDelete(r.id)}
              onOpenComparison={handleOpenComparison}
            />
          )}

          {/* TAB 2: TELAAH BARU */}
          {currentTab === 'new' && (
            <NewAnalysisView
              onAnalysisSuccess={handleAnalysisSuccess}
              settings={settings}
              preFillTeacherInfo={preFillTeacherInfo}
              onClearPreFill={() => setPreFillTeacherInfo(null)}
              onNavigateComparison={handleOpenComparison}
            />
          )}

          {/* TAB 3: HASIL TELAAH */}
          {currentTab === 'detail' && (
            <>
              {selectedReport ? (
                <ReportDetailView
                  report={selectedReport}
                  allReports={reports}
                  onUpdateReport={handleUpdateReport}
                  onOpenFullEditModal={() => setIsEditModalOpen(true)}
                  onNavigateNew={() => setCurrentTab('new')}
                  onOpenComparison={handleOpenComparison}
                />
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <span className="text-2xl font-bold">RPP</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Belum Ada Laporan Telaah Terpilih
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih dokumen dari menu Riwayat atau mulai unggah RPP/Modul Ajar baru untuk melihat analisis detail.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('new')}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
                  >
                    + Telaah RPP Baru
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 4: KOMPARASI REVISI */}
          {currentTab === 'comparison' && (
            <ComparisonView
              reports={reports}
              initialTeacherName={comparisonTeacherName}
              initialBeforeReportId={comparisonBeforeReportId}
              initialAfterReportId={comparisonAfterReportId}
              onSelectReport={handleSelectReport}
              onNavigateNewWithTeacher={handleNavigateNewWithTeacher}
            />
          )}

          {/* TAB 5: RIWAYAT */}
          {currentTab === 'history' && (
            <HistoryView
              reports={reports}
              recycleBinReports={recycleBinReports}
              onSelectReport={handleSelectReport}
              onEditReport={handleEditReport}
              onSoftDeleteReport={handleSoftDelete}
              onRestoreReport={handleRestore}
              onPermanentDeleteReport={handlePermanentDelete}
              onClearAllActiveReports={handleClearAllActive}
              onClearRecycleBin={handleClearTrash}
              onOpenComparison={handleOpenComparison}
            />
          )}

          {/* TAB 6: INSTRUMEN 22 INDIKATOR */}
          {currentTab === 'instrument' && <InstrumentGuideView />}

          {/* TAB 7: PENGATURAN */}
          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newS) => setSettings(newS)}
              reports={reports}
              onReloadReports={reloadData}
            />
          )}
        </main>
      </div>

      {/* Full Edit Modal */}
      {selectedReport && (
        <EditReportModal
          isOpen={isEditModalOpen}
          report={selectedReport}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateReport}
        />
      )}
    </div>
  );
}
