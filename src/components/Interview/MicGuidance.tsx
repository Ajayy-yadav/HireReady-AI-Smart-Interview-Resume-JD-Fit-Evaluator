import { Mic, MicOff } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface MicGuidanceProps {
  isRecording: boolean;
  isPlayingAudio: boolean;
}

export function MicGuidance({ isRecording, isPlayingAudio }: MicGuidanceProps) {
  return (
    <section
      className="relative rounded-2xl border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] p-5 animate-scale-in"
      style={{ animationDelay: "0.4s" }}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="flex items-center gap-4">
        <div
          className={[
            "rounded-full w-12 h-12 grid place-items-center transition-all duration-300",
            isRecording
              ? "bg-red-500/20 ring-2 ring-red-500/40"
              : isPlayingAudio
              ? "bg-primary/20 ring-2 ring-primary/40"
              : "bg-muted",
          ].join(" ")}
          aria-hidden
        >
          {isRecording ? (
            <Mic className="w-5 h-5 text-red-500" />
          ) : (
            <MicOff className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground mb-1">
            {isPlayingAudio
              ? "Playing question…"
              : isRecording
              ? "Listening…"
              : "Standby"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isPlayingAudio
              ? "Please wait for the question to finish."
              : isRecording
              ? "Speak your answer, pause ~2s when done."
              : "Preparing next question…"}
          </p>
        </div>
      </div>
    </section>
  );
}
