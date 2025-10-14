"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Home,
  RotateCcw,
  TrendingUp,
  Target,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { SessionResult } from "@/types/interviewTs";
import axios from "axios";
import { useEffect, useState } from "react";

interface InterviewCompleteProps {
  sessionId: string;
  totalQuestions: number;
  onRestart?: () => void;
}

export default function InterviewComplete({
  sessionId,
  totalQuestions,
  onRestart,
}: InterviewCompleteProps) {
  const [feedback, setFeedback] = useState<SessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = async (): Promise<SessionResult> => {
    const data = await axios.get<SessionResult>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/interview/${sessionId}/feedback`
    );
    return data.data;
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        setFeedback(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  console.log("fetched data:", feedback);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 md:px-6 py-8">
      <Card className="w-full  border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <CheckCircle
                className="w-6 h-6 text-primary"
                aria-hidden="true"
              />
            </div>
            <div>
              <CardTitle className="text-2xl text-card-foreground text-balance">
                Interview Completed!
              </CardTitle>
              <CardDescription className="text-base mt-1 text-pretty">
                Great job! You've successfully completed all {totalQuestions}{" "}
                questions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                Loading your feedback...
              </p>
            </div>
          ) : feedback ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Target
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Questions
                      </p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {totalQuestions}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Overall Score
                      </p>
                      <p className="text-2xl font-bold text-card-foreground">
                        {feedback.feedback.overallScore} / 5
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="w-5 h-5 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Status
                      </p>
                      <p className="text-2xl font-bold text-card-foreground">
                        ✓
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Performance Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="text-base font-semibold text-card-foreground">
                    Performance Summary
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback.feedback.detailedFeedback}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Sparkles
                          className="w-4 h-4 text-primary mt-0.5"
                          aria-hidden="true"
                        />
                        <h3 className="text-base font-semibold text-card-foreground">
                          Strengths
                        </h3>
                      </div>
                      <ul className="space-y-2 ml-6">
                        {feedback.feedback.strengths.map((strength, index) => (
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
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Target
                          className="w-4 h-4 text-primary mt-0.5"
                          aria-hidden="true"
                        />
                        <h3 className="text-base font-semibold text-card-foreground">
                          Areas for Improvement
                        </h3>
                      </div>
                      <ul className="space-y-2 ml-6">
                        {feedback.feedback.areasForImprovement.map(
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
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb
                      className="w-4 h-4 text-primary mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-card-foreground">
                        Recommendations
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-6">
                    {feedback.feedback.recommendations.map((rec, index) => (
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
            </>
          ) : null}

          <div className="flex justify-center pt-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              {onRestart && (
                <Button onClick={onRestart} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start New Interview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
