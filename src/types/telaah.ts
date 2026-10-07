export type ScoreType = 0 | 1 | 2 | 'N/A';

export type StatusType = 'Terpenuhi Optimal' | 'Terpenuhi Sebagian' | 'Belum Terpenuhi' | 'N/A';

export type PredicateType = 'SANGAT BAIK' | 'BAIK' | 'CUKUP' | 'PERLU PERBAIKAN';

export type FollowUpCategoryType = 'Penyempurnaan Minor' | 'Revisi Terbatas' | 'Revisi Terarah' | 'Revisi Mendasar';

export type PriorityLevel = 'Sangat Tinggi' | 'Tinggi' | 'Sedang';

export interface IndicatorDefinition {
  id: number;
  name: string;
  isOptional: boolean;
  category: 'Identitas & Perencanaan' | 'Dimensi & Keselarasan' | 'Pedagogi & Lingkungan' | 'Pengalaman Belajar' | 'Prinsip & Karakteristik' | 'Asesmen & Evaluasi';
  description: string;
  checklist: string[];
  rubric2: string;
  rubric1: string;
  rubric0: string;
  rubricNA?: string;
}

export interface IndicatorResult {
  id: number;
  name: string;
  isOptional: boolean;
  status: StatusType;
  score: ScoreType;
  evidence: string;
  criticalComment: string;
  recommendation: string;
}

export interface DocumentIdentity {
  teacherName: string;
  teacherNip?: string;
  subject: string;
  gradePhase: string;
  school: string;
  title: string;
  topic: string;
  timeAllocation: string;
  reviewDate: string;
  uploadDate?: string;
  reviewerName: string;
  reviewerNip?: string;
}

export interface IncompatibleComponent {
  indicatorName: string;
  finding: string;
  reason: string;
  recommendation: string;
}

export interface ExtraNote {
  componentName: string;
  finding: string;
  recommendation: string;
}

export interface ImprovementPriority {
  level: PriorityLevel;
  indicatorName: string;
  score: ScoreType;
  issue: string;
  recommendation: string;
}

export interface FeedbackData {
  strengths: string[];
  improvements: string[];
  practicalRecommendations: string[];
  followUpSteps: string[];
}

export interface CalculationSummary {
  totalIndicators: number; // 22
  evaluatedCount: number;
  naCount: number;
  totalScore: number;
  maxPossibleScore: number;
  finalScore: number;
  predicate: PredicateType;
  followUpCategory: FollowUpCategoryType;
  scoreCounts: {
    score2: number;
    score1: number;
    score0: number;
    na: number;
  };
}

export interface AnalysisReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  identity: DocumentIdentity;
  indicators: IndicatorResult[];
  summary: CalculationSummary;
  incompatibleComponents: IncompatibleComponent[];
  extraNotes: ExtraNote[];
  feedback: FeedbackData;
  reviewDescription: string;
  priorities: ImprovementPriority[];
}
