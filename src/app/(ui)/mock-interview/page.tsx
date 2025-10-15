"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import InterviewSetup from "@/components/Interview/InterviewSetup";
import InterviewSession from "@/components/Interview/InterviewSession";
import InterviewComplete from "@/components/Interview/InterviewComplete";
import { GradientBackground } from "@/components/GradientBackground";

type InterviewStage = "setup" | "interview" | "complete";

export default function MockInterviewPage() {
  const { user } = useUser();
  const [stage, setStage] = useState<InterviewStage>("setup");
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [completedSessionId, setCompletedSessionId] = useState("");

  const handleStart = (jobDesc: string, questions: number) => {
    setJobDescription(jobDesc);
    setTotalQuestions(questions);
    setStage("interview");
  };

  const handleComplete = (sessionId: string) => {
    setCompletedSessionId(sessionId);
    setStage("complete");
  };

  const handleRestart = () => {
    setJobDescription("");
    setTotalQuestions(5);
    setCompletedSessionId("");
    setStage("setup");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <GradientBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className=" text-center">
          <h1 className="text-3xl font-bold text-foreground">
            AI Interview Practice
          </h1>
          <p className="text-muted-foreground mt-2">
            Practice your interview skills with real-time AI feedback
          </p>
        </div>

        {/* Content based on stage */}
        {stage === "setup" && <InterviewSetup onStart={handleStart} />}

        {stage === "interview" && user && (
          <InterviewSession
            userId={user.id}
            jobDescription={jobDescription}
            totalQuestions={totalQuestions}
            onComplete={handleComplete}
          />
        )}

        {stage === "complete" && (
          <InterviewComplete
            sessionId={completedSessionId}
            totalQuestions={totalQuestions}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
