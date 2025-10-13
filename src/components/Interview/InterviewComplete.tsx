"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-card border-border">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-green-500/10">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-card-foreground">
                Interview Completed!
              </h2>
              <p className="text-lg text-muted-foreground">
                Great job! You've successfully completed all {totalQuestions}{" "}
                questions.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-card-foreground">
                  {totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">
                  Questions Answered
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-card-foreground">✓</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            {/* Session ID */}
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center pt-6">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              {onRestart && (
                <Button onClick={onRestart}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Interview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
