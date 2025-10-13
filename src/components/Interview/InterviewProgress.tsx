import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface InterviewProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  isConnected: boolean;
  progressPercentage: number;
}

export function InterviewProgress({
  currentQuestion,
  totalQuestions,
  isConnected,
  progressPercentage,
}: InterviewProgressProps) {
  return (
    <section
      className="relative rounded-2xl border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] p-5 animate-scale-in"
      style={{ animationDelay: "0.2s" }}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Question
          </p>
          <p className="text-xl font-bold text-foreground">
            {currentQuestion}{" "}
            <span className="text-muted-foreground font-normal">of</span>{" "}
            {totalQuestions}
          </p>
        </div>
        <div className="flex-1 min-w-[200px] max-w-md">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="shrink-0">
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="text-xs px-3 py-1.5"
          >
            <span
              className={[
                "inline-block w-1.5 h-1.5 rounded-full mr-1.5",
                isConnected
                  ? "bg-green-400 animate-pulse"
                  : "bg-muted-foreground",
              ].join(" ")}
            />
            {isConnected ? "Connected" : "Connecting…"}
          </Badge>
        </div>
      </div>
    </section>
  );
}
