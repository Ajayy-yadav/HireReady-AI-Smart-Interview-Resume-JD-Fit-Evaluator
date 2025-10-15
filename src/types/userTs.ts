export interface User {
  id: string;
  email: string;
  imageKey: string;
  username: string;
  currentRole: string;
  createdAt: string;
  updatedAt: string;
  lastInterviewCompletedAt: string | null;
  lastResumeAnalysisAt: string | null;
  latestInterviewScore: number | null;
  latestResumeScore: number | null;
  resumeKey: string | null;
  totalInterviews: number;
}

