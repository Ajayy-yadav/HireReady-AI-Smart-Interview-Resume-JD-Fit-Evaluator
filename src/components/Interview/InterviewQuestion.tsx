import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface InterviewQuestionProps {
  questionText: string;
  isGeneratingQuestions: boolean;
}

export function InterviewQuestion({
  questionText,
  isGeneratingQuestions,
}: InterviewQuestionProps) {
  return (
    <Card className="relative rounded-2xl border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Current Question
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {isGeneratingQuestions ? (
          <div className="flex items-center gap-3 py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">Generating interview questions…</span>
          </div>
        ) : (
          <p className="text-base text-foreground leading-relaxed">
            {questionText || "Loading…"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
