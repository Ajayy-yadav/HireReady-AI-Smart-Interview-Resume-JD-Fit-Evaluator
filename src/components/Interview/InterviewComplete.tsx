"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { SessionResult } from "@/types/interviewTs";
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
  const [feedback,setFeedback]= useState<SessionResult|null>(null);
  const router = useRouter();
  const fetchData=async():Promise<SessionResult>=>{
    const data=await axios.get<SessionResult>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/interview/${sessionId}/feedback`
    )
    return data.data;
  }
  useEffect(()=>{
    fetchData().then((data)=>{
    setFeedback(data);
    })
  },[])
  console.log("fetched data:",feedback);
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

            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
              {feedback && (
                <div className="pt-8 text-left max-w-2xl mx-auto space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                      Overall Score:{" "}
                      <span className="text-green-600 font-bold">
                        {feedback.feedback.overallScore} / 5
                      </span>
                    </h3>
                    <p className="text-muted-foreground">
                      {feedback.feedback.detailedFeedback}
                    </p>
                  </div>

                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-card-foreground">
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {feedback.feedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-card-foreground">
                      Areas for Improvement
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {feedback.feedback.areasForImprovement.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>

                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-card-foreground">
                      Recommendations
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {feedback.feedback.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
}


