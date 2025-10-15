"use client";

import { Mic } from "lucide-react";

interface RecordingIndicatorProps {
  isRecording: boolean;
}

export function RecordingIndicator({ isRecording }: RecordingIndicatorProps) {
  if (!isRecording) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full shadow-lg border border-red-400/50">
        <div className="relative">
          <Mic className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium">Recording Interview</span>
      </div>
    </div>
  );
}
