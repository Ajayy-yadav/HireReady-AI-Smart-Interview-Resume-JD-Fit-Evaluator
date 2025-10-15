"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Loader, Play, Pause } from "lucide-react";
import { useSignedUrl } from "@/lib/aws/get-obj-url";
import { Button } from "@/components/ui/button";

// Event to pause all other audio players
const PAUSE_OTHER_AUDIO_EVENT = "pauseOtherAudio";

export default function VoiceUI({
  recordingKey,
  className,
}: {
  recordingKey: string;
  className?: string;
}) {
  const { data: audioUrl, isLoading } = useSignedUrl(recordingKey);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioIdRef = useRef<string>(Math.random().toString(36));

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Pause this audio if another one starts playing
  const handlePauseOtherAudio = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const playingAudioId = customEvent.detail.audioId;

    // If the event is not from this audio player, pause this one
    if (playingAudioId !== audioIdRef.current && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Listen for pause events from other audio players
  useEffect(() => {
    window.addEventListener(PAUSE_OTHER_AUDIO_EVENT, handlePauseOtherAudio);

    return () => {
      window.removeEventListener(
        PAUSE_OTHER_AUDIO_EVENT,
        handlePauseOtherAudio
      );
    };
  }, [handlePauseOtherAudio]);

  // Handle audio loaded metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Dispatch event to pause all other audio players
      window.dispatchEvent(
        new CustomEvent(PAUSE_OTHER_AUDIO_EVENT, {
          detail: { audioId: audioIdRef.current },
        })
      );
      audio.play();
    }
  };

  // Generate wave heights for animation
  const waveCount = 80;
  const waves = Array.from({ length: waveCount }, (_, i) => {
    const position = i / waveCount;
    const baseHeight =
      Math.sin(position * Math.PI * 4) * 30 +
      Math.sin(position * Math.PI * 8) * 15 +
      Math.sin(position * Math.PI * 16) * 8 +
      40;
    const animatedHeight = isPlaying
      ? baseHeight * (0.7 + Math.sin(Date.now() / 100 + i) * 0.3)
      : baseHeight * 0.5;
    return Math.max(10, Math.min(100, animatedHeight));
  });

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 w-full ${className}`}>
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading audio...</span>
      </div>
    );
  }

  if (!audioUrl) {
    return (
      <div className={`flex items-center gap-3 w-full ${className}`}>
        <span className="text-sm text-muted-foreground">
          No recording available
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlayPause}
        disabled={!audioUrl}
        className="flex-shrink-0 h-8 w-8"
        aria-label={isPlaying ? "Pause recording" : "Play recording"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      {/* Waveform Visualization */}
      <div className="flex-1 flex items-center justify-center gap-[2px] h-12 rounded-lg px-2">
        {waves.map((height, index) => {
          // Calculate gradient color based on position (pink/magenta to blue/cyan)
          const position = index / waveCount;

          // Create gradient from pink (#E91E8C) through purple to blue (#4A9EFF)
          let color;
          if (position < 0.5) {
            // Pink to Purple transition
            const localPos = position * 2;
            const r = Math.round(233 - (233 - 147) * localPos);
            const g = Math.round(30 + (82 - 30) * localPos);
            const b = Math.round(140 + (234 - 140) * localPos);
            color = `rgb(${r}, ${g}, ${b})`;
          } else {
            // Purple to Blue transition
            const localPos = (position - 0.5) * 2;
            const r = Math.round(147 - (147 - 74) * localPos);
            const g = Math.round(82 + (158 - 82) * localPos);
            const b = Math.round(234 + (255 - 234) * localPos);
            color = `rgb(${r}, ${g}, ${b})`;
          }

          return (
            <div
              key={index}
              className="flex-1 rounded-full transition-all duration-100"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                opacity: audioUrl ? (isPlaying ? 1 : 0.6) : 0.3,
                minWidth: "2px",
              }}
            />
          );
        })}
      </div>

      {/* Time Display */}
      <span className="text-sm text-muted-foreground font-mono flex-shrink-0 min-w-[3rem]">
        {duration > 0 ? formatTime(currentTime) : "0:00"}
      </span>
    </div>
  );
}
