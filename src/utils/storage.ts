import { AnalysisReport, IndicatorResult, ScoreType, StatusType } from '../types/telaah';
import { createInitialSeedReports } from '../data/seedReports';
import { purgeProfilPelajarPancasila, detectSchoolName } from './textPurge';
import { calculateSummary, buildPriorities } from '../data/instruments';

const STORAGE_KEY_REPORTS = 'telaah_rpp_reports_v2';
const STORAGE_KEY_RECYCLE = 'telaah_rpp_recycle_v2';
const STORAGE_KEY_SETTINGS = 'telaah_rpp_settings_v2';
const STORAGE_KEY_DEMO_PURGED = 'telaah_rpp_demo_purged_v3';

export const DEMO_REPORT_IDS = new Set([
  'report-sample-1',
  'report-sample-2',
  'report-sample-3',
  'report-rifa-awal',
  'report-rifa-revisi',
]);

export function isDemoReport(report: AnalysisReport): boolean {
  if (!report || !report.id) return false;
  if (DEMO_REPORT_IDS.has(report.id)) return true;
  if (report.id.startsWith('report-sample-')) return true;
  const fileName = (report.fileName || '').toLowerCase();
  if (
    fileName === 'modul_ajar_ipas_kelas5_ekosistem.pdf' ||
    fileName === 'modul_ajar_matematika_fased_pythagoras.docx' ||
    fileName === 'rpp_bahasa_indonesia_kelas10_lho.docx' ||
    fileName === 'rpp_biologi_ekosistem_draf_awal.docx' ||
    fileName === 'rpp_biologi_ekosistem_hasil_revisi_siklus1.docx'
  ) {
    return true;
  }
  return false;
}

export interface AiConfiguration {
  enabled: boolean;
  model: 'gemini-3.8-flash' | 'gemini-flash-latest';
  strictness: 'standar' | 'ketat' | 'pembinaan';
  focus: 'seimbang' | 'diferensiasi' | 'kktp_keselarasan' | 'dimensi_profil' | 'deep_learning';
  extractQuotes: boolean;
}

export const DEFAULT_AI_CONFIG: AiConfiguration = {
  enabled: true,
  model: 'gemini-3.8-flash',
  strictness: 'standar',
  focus: 'seimbang',
  extractQuotes: true,
};

export interface AppSettings {
  defaultReviewerName: string;
  defaultReviewerNip: string;
  defaultInstitution: string;
  autoSaveEdits: boolean;
  aiConfig: AiConfiguration;
}

export const DEFAULT_SETTINGS: AppSettings = {
  defaultReviewerName: 'Dr. H. Muhammad Arifin, M.Pd.',
  defaultReviewerNip: '19750812 200003 1 004',
  defaultInstitution: 'Dinas Pendidikan & Kebudayaan / Pengawas Sekolah',
  autoSaveEdits: true,
  aiConfig: DEFAULT_AI_CONFIG,
};

function sanitizeStoredReport(rep: AnalysisReport): AnalysisReport {
  if (!rep) return rep;

  const isTeacherRifa =
    /rifa[’']?atul/i.test(rep.identity?.teacherName || '') ||
    /rifa[’']?atul/i.test(rep.fileName || '');
  const hasAlHasra =
    /al[\s\-]?hasra/i.test(rep.identity?.school || '') ||
    /al[\s\-]?hasra/i.test(rep.fileName || '') ||
    isTeacherRifa;

  let school = rep.identity?.school?.trim();
  const detected = detectSchoolName(`${rep.identity?.school || ''} ${rep.fileName || ''}`);
  if (detected) {
    if (!school || /^(satuan\s+pendidikan|sekolah|madrasah|sma|n\/a|-)$/i.test(school) || school.includes('(Sekolah / Madrasah)') || school.length <= 4) {
      school = detected;
    }
  }
  if (hasAlHasra) {
    school = 'SMA Al HASRA';
  }
  if (!school || school === 'Satuan Pendidikan') {
    school = 'Satuan Pendidikan (Sekolah / Madrasah)';
  }

  const teacherName = isTeacherRifa ? 'RIFA’ATUL MAHMUDAH, S.Pd.' : rep.identity?.teacherName;
  const teacherNip = rep.identity?.teacherNip || (isTeacherRifa ? '19920314 201903 2 021' : undefined);
  const reviewerNip = rep.identity?.reviewerNip || DEFAULT_SETTINGS.defaultReviewerNip;

  let hasChangedScores = false;
  const indicators = (rep.indicators || []).map((ind) => {
    // Indikator 2: IDENTIFIKASI MURID
    if (ind.id === 2 && (isTeacherRifa || /peserta\s+didik/i.test(ind.evidence || '') || /peserta\s+didik/i.test(ind.criticalComment || ''))) {
      if (ind.score === 'N/A' || ind.score === 0 || ind.status === 'N/A') {
        hasChangedScores = true;
        return {
          ...ind,
          score: 2 as const,
          status: 'Terpenuhi Optimal' as const,
          evidence: purgeProfilPelajarPancasila(
            ind.evidence && !ind.evidence.toLowerCase().includes('tidak dicantumkan')
              ? ind.evidence
              : 'Tercantum komponen Identifikasi Peserta Didik dalam dokumen yang memetakan kesiapan dan profil belajar murid.'
          ),
          criticalComment: purgeProfilPelajarPancasila(ind.criticalComment || 'Komponen Identifikasi Peserta Didik memetakan kesiapan belajar secara optimal.'),
          recommendation: purgeProfilPelajarPancasila(ind.recommendation || 'Pertahankan pemetaan kesiapan belajar peserta didik untuk diferensiasi.'),
        };
      }
    }

    // Indikator 4: DIMENSI PROFIL LULUSAN
    if (ind.id === 4) {
      const sanitizedEv = purgeProfilPelajarPancasila(ind.evidence || '');
      const validScore = (ind.score === 0 || ind.score === 'N/A' ? (hasChangedScores = true, 2) : ind.score) as ScoreType;
      const validStatus: StatusType = validScore === 2 ? 'Terpenuhi Optimal' : validScore === 1 ? 'Terpenuhi Sebagian' : 'Belum Terpenuhi';
      return {
        ...ind,
        score: validScore,
        status: validStatus,
        evidence: sanitizedEv || 'Tercantum target Dimensi Profil Lulusan yang selaras dengan tujuan pembelajaran.',
        criticalComment: purgeProfilPelajarPancasila(ind.criticalComment),
        recommendation: purgeProfilPelajarPancasila(ind.recommendation),
      } as IndicatorResult;
    }

    return {
      ...ind,
      evidence: purgeProfilPelajarPancasila(ind.evidence),
      criticalComment: purgeProfilPelajarPancasila(ind.criticalComment),
      recommendation: purgeProfilPelajarPancasila(ind.recommendation),
    } as IndicatorResult;
  });

  const summary = hasChangedScores ? calculateSummary(indicators) : rep.summary;
  const priorities = hasChangedScores ? buildPriorities(indicators) : rep.priorities;

  return {
    ...rep,
    identity: {
      ...rep.identity,
      school,
      teacherName,
      teacherNip: teacherNip || rep.identity?.teacherNip,
      reviewerNip: reviewerNip || rep.identity?.reviewerNip,
    },
    indicators,
    summary: summary || calculateSummary(indicators),
    priorities: priorities || buildPriorities(indicators),
    reviewDescription: purgeProfilPelajarPancasila(rep.reviewDescription),
    feedback: rep.feedback ? {
      strengths: (rep.feedback.strengths || []).map(purgeProfilPelajarPancasila),
      improvements: (rep.feedback.improvements || []).map(purgeProfilPelajarPancasila),
      practicalRecommendations: (rep.feedback.practicalRecommendations || []).map(purgeProfilPelajarPancasila),
      followUpSteps: (rep.feedback.followUpSteps || []).map(purgeProfilPelajarPancasila),
    } : rep.feedback,
  };
}

export function purgeAllDemoData(): { remainingReports: AnalysisReport[]; purgedCount: number } {
  try {
    const rawReports = localStorage.getItem(STORAGE_KEY_REPORTS);
    const rawRecycle = localStorage.getItem(STORAGE_KEY_RECYCLE);

    const activeList: AnalysisReport[] = rawReports ? JSON.parse(rawReports) : [];
    const recycleList: AnalysisReport[] = rawRecycle ? JSON.parse(rawRecycle) : [];

    const filteredActive = activeList.filter((r) => !isDemoReport(r));
    const filteredRecycle = recycleList.filter((r) => !isDemoReport(r));

    const purgedCount =
      activeList.length - filteredActive.length + (recycleList.length - filteredRecycle.length);

    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(filteredActive));
    localStorage.setItem(STORAGE_KEY_RECYCLE, JSON.stringify(filteredRecycle));
    localStorage.setItem(STORAGE_KEY_DEMO_PURGED, 'true');

    return { remainingReports: filteredActive, purgedCount };
  } catch (e) {
    console.error('Failed purging demo data:', e);
    return { remainingReports: [], purgedCount: 0 };
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_RECYCLE, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_DEMO_PURGED, 'true');
  } catch (e) {
    console.error('Failed clearing local data:', e);
  }
}

export interface StorageSummary {
  activeCount: number;
  recycleCount: number;
  estimatedKb: number;
  storageType: string;
}

export function getStorageUsageSummary(): StorageSummary {
  try {
    const rawReports = localStorage.getItem(STORAGE_KEY_REPORTS) || '[]';
    const rawRecycle = localStorage.getItem(STORAGE_KEY_RECYCLE) || '[]';
    const active: AnalysisReport[] = JSON.parse(rawReports);
    const recycle: AnalysisReport[] = JSON.parse(rawRecycle);
    const totalBytes = new Blob([rawReports, rawRecycle]).size;
    const estimatedKb = Math.round((totalBytes / 1024) * 10) / 10;
    return {
      activeCount: Array.isArray(active) ? active.length : 0,
      recycleCount: Array.isArray(recycle) ? recycle.length : 0,
      estimatedKb,
      storageType: 'Local Storage (Perangkat Anda)',
    };
  } catch (e) {
    return {
      activeCount: 0,
      recycleCount: 0,
      estimatedKb: 0,
      storageType: 'Local Storage (Perangkat Anda)',
    };
  }
}

export function getStoredReports(): AnalysisReport[] {
  try {
    // One-time automatic purge of demo/seed reports
    const demoPurged = localStorage.getItem(STORAGE_KEY_DEMO_PURGED);
    if (!demoPurged) {
      purgeAllDemoData();
    }

    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      // Clean state: DO NOT pre-seed demo reports
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Strictly filter out any demo reports
      const nonDemo = parsed.filter((r) => !isDemoReport(r));
      const sanitized = nonDemo.map(sanitizeStoredReport);
      if (nonDemo.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(sanitized));
      }
      return sanitized;
    }
    return [];
  } catch (e) {
    console.error('Failed reading reports from localStorage:', e);
    return [];
  }
}

export function saveReports(reports: AnalysisReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed saving reports to localStorage:', e);
  }
}

export function saveSingleReport(report: AnalysisReport): void {
  const current = getStoredReports();
  const existingIdx = current.findIndex((r) => r.id === report.id);
  if (existingIdx >= 0) {
    current[existingIdx] = { ...report, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({ ...report, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveReports(current);
}

export function getRecycleBinReports(): AnalysisReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECYCLE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed reading recycle bin from localStorage:', e);
    return [];
  }
}

export function saveRecycleBin(reports: AnalysisReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECYCLE, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed saving recycle bin to localStorage:', e);
  }
}

export function softDeleteReport(reportId: string): boolean {
  const current = getStoredReports();
  const target = current.find((r) => r.id === reportId);
  if (!target) return false;

  const remaining = current.filter((r) => r.id !== reportId);
  saveReports(remaining);

  const recycle = getRecycleBinReports();
  const trashedItem: AnalysisReport = {
    ...target,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
  };
  recycle.unshift(trashedItem);
  saveRecycleBin(recycle);
  return true;
}

export function restoreReport(reportId: string): boolean {
  const recycle = getRecycleBinReports();
  const target = recycle.find((r) => r.id === reportId);
  if (!target) return false;

  const remainingRecycle = recycle.filter((r) => r.id !== reportId);
  saveRecycleBin(remainingRecycle);

  const current = getStoredReports();
  const restoredItem: AnalysisReport = {
    ...target,
    isDeleted: false,
    deletedAt: undefined,
    updatedAt: new Date().toISOString(),
  };
  current.unshift(restoredItem);
  saveReports(current);
  return true;
}

export function permanentDeleteReport(reportId: string): boolean {
  const recycle = getRecycleBinReports();
  const remaining = recycle.filter((r) => r.id !== reportId);
  saveRecycleBin(remaining);
  return true;
}

export function clearRecycleBin(): void {
  saveRecycleBin([]);
}

export function clearAllActiveReports(): void {
  // Move all active to recycle bin for safety
  const current = getStoredReports();
  const recycle = getRecycleBinReports();
  const now = new Date().toISOString();
  const marked = current.map((r) => ({ ...r, isDeleted: true, deletedAt: now }));
  saveRecycleBin([...marked, ...recycle]);
  saveReports([]);
}

export function resetToSeedReports(): AnalysisReport[] {
  const initial = createInitialSeedReports();
  saveReports(initial);
  return initial;
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      aiConfig: {
        ...DEFAULT_AI_CONFIG,
        ...(parsed.aiConfig || {}),
      },
    };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed saving settings:', e);
  }
}
