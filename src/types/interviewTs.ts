export interface Feedback {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  recommendations: string[];
}

// Complete session result structure
export interface SessionResult {
  sessionId: string;
  feedback: Feedback;
  totalQuestions: number;
  completedQuestions: number;
  status: "completed" | "in-progress" | "pending"; // You can expand this if needed
  cached: boolean;
}