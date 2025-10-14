"use client";

import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import type { UserInterviewsResponse, Interview } from "@/types/historyTs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  TrendingUp,
  Target,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import VoiceUI from "@/components/dashboard/user/voice-ui";

function InterviewCard({ interview }: { interview: Interview }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullJD, setShowFullJD] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const JD_PREVIEW_LENGTH = 120;
  const jobDescription =
    interview.jobDescription || "No job description provided";
  const shouldTruncateJD = jobDescription.length > JD_PREVIEW_LENGTH;
  const displayedJD = showFullJD
    ? jobDescription
    : jobDescription.substring(0, JD_PREVIEW_LENGTH) +
      (shouldTruncateJD ? "..." : "");

  return (
    <Card className="w-full border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] transition-all duration-200 hover:shadow-md">
      <CardContent className="">
        {/* Collapsed View */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-card-foreground">
                  {formatDate(interview.startedAt)}
                </span>
              </div>

              {/* Job Description Preview with See More/Less */}
              <div className="flex items-start gap-2">
                <Briefcase
                  className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayedJD}
                  </p>
                  {shouldTruncateJD && (
                    <button
                      onClick={() => setShowFullJD(!showFullJD)}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {showFullJD ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              </div>

              {interview.recordingKey && (
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <VoiceUI recordingKey={interview.recordingKey} />
                  </div>
                </div>
              )}
            </div>

            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Expanded View */}
          {isExpanded && interview.hasFeedback && (
            <div className="pt-4 border-t border-border space-y-4 animate-in slide-in-from-top-2 duration-200">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Target
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Questions
                      </p>
                      <p className="text-xl font-bold text-card-foreground">
                        {interview.totalQuestions}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Overall Score
                      </p>
                      <p className="text-xl font-bold text-card-foreground">
                        {interview.feedback.overallScore} / 5
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Duration
                      </p>
                      <p className="text-xl font-bold text-card-foreground">
                        {interview.duration} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Job Description */}
              {interview.jobDescription && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <h3 className="text-base font-semibold text-card-foreground">
                    Job Description
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {interview.jobDescription}
                  </p>
                </div>
              )}

              {/* Performance Summary */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <h3 className="text-base font-semibold text-card-foreground">
                  Performance Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {interview.feedback.detailedFeedback}
                </p>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Sparkles
                        className="w-4 h-4 text-primary mt-0.5"
                        aria-hidden="true"
                      />
                      <h3 className="text-base font-semibold text-card-foreground">
                        Strengths
                      </h3>
                    </div>
                    <ul className="space-y-1.5 ml-6">
                      {interview.feedback.strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground leading-relaxed"
                        >
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Target
                        className="w-4 h-4 text-primary mt-0.5"
                        aria-hidden="true"
                      />
                      <h3 className="text-base font-semibold text-card-foreground">
                        Areas for Improvement
                      </h3>
                    </div>
                    <ul className="space-y-1.5 ml-6">
                      {interview.feedback.areasForImprovement.map(
                        (area, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground leading-relaxed"
                          >
                            • {area}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Lightbulb
                    className="w-4 h-4 text-primary mt-0.5"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-card-foreground">
                    Recommendations
                  </h3>
                </div>
                <ul className="space-y-1.5 ml-6">
                  {interview.feedback.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ActivityLog() {
  const { user } = useUser();

  const { data: history, isLoading } = useQuery<UserInterviewsResponse>({
    queryKey: ["interview-history", user?.id],
    queryFn: async () => {
      const res = await axios.get<UserInterviewsResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/interview/user/${user?.id}/completed`
      );
      console.log("response in history:", res.data);
      return res.data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-card-foreground">
          Interview Activity Log
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          View your completed interviews and performance feedback
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading your interview history...
          </p>
        </div>
      ) : history && history.interviews.length > 0 ? (
        <div className="space-y-4">
          {history.interviews.map((interview) => (
            <InterviewCard key={interview.sessionId} interview={interview} />
          ))}
        </div>
      ) : (
        <Card className="w-full border border-black/10">
          <CardContent className="p-12 text-center">
            <p className="text-base text-muted-foreground">
              No completed interviews yet. Start your first interview to see
              your activity here!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
