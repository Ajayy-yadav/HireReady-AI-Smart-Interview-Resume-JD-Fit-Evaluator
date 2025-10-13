"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserInterviewsResponse } from "@/types/historyTs";

export default function ActivityLog() {
  const [history, setHistory] = useState<UserInterviewsResponse | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return; // wait until user is loaded

    const fetchHistory = async () => {
      try {
        const res = await axios.get<UserInterviewsResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/interview/user/${user.id}/completed`
        );
        console.log("response in history:", res.data);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [user?.id]);

  console.log("user id in history:", user?.id);
  console.log("history:", history);

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-semibold mb-4">Interview Activity Log</h1>
      {history ? (
        <div className="space-y-4">
          <p>Total Interviews: {history.totalInterviews}</p>
          <div className="grid gap-4">
            {history.interviews.map((interview) => (
              <div
                key={interview.sessionId}
                className="border p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h2 className="font-medium">
                  Session ID: {interview.sessionId}
                </h2>
                <p>Questions Answered: {interview.answeredQuestions}</p>
                <p>Score: {interview.feedback.overallScore}/5</p>
                <p>
                  Duration: {interview.duration} mins <br />
                  Completed: {new Date(interview.completedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading interview history...</p>
      )} */}
    </div>
  );
}
