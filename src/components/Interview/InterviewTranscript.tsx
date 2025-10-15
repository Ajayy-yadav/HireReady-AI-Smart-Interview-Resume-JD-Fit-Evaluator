import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface InterviewTranscriptProps {
  transcript: string;
  isRecording: boolean;
}

export function InterviewTranscript({
  transcript,
  isRecording,
}: InterviewTranscriptProps) {
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
          Your Answer (Live Transcript)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {transcript ? (
          <div className="relative">
            <p
              className={[
                "text-base leading-relaxed",
                "live-transcript",
                isRecording ? "animate-transcript" : "",
                "text-foreground",
              ].join(" ")}
            >
              {transcript}
              <span
                className="inline-block w-0.5 h-[1.2em] align-[-0.15em] bg-primary animate-pulse ml-1"
                aria-hidden
              />
            </p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-4">
            Awaiting your response. Speak naturally after the question finishes.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
