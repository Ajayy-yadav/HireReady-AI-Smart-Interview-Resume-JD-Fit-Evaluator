export type Role = "assistant" | "user";

export interface HistoryItem {
  role: Role;
  content: string;
}

export interface Feedback {
  strengths: string[];
  overallScore: number; // e.g. 4
  recommendations: string[];
  detailedFeedback: string;
  areasForImprovement: string[];
}

export interface Interview {
  sessionId: string;
  jobDescription?: string;
  totalQuestions: number;
  answeredQuestions: number;
  history: HistoryItem[];
  feedback: Feedback;
  hasFeedback: boolean;
  hasVideoRecording: boolean;
  startedAt: string; // ISO datetime string e.g. "2025-10-13T07:25:11.559Z"
  completedAt: string; // ISO datetime string
  duration: number; // in minutes (or the unit your backend uses)
}

export interface UserInterviewsResponse {
  userId: string;
  totalInterviews: number;
  interviews: Interview[];
}