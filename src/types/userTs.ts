export interface User {
  id: string;
  email: string;
  imageKey: string | null;
  username: string;
  currentRole: string;
  resumeUrl: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}