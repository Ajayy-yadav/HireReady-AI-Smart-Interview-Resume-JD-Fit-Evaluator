import { useState, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { useAtom } from "jotai";
import { userDataAtom } from "@/store/atom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "@/types/userTs";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { VoiceIndicator } from "./VoiceIndicator";
import { InterviewProgress } from "./InterviewProgress";
import { InterviewQuestion } from "./InterviewQuestion";
import { InterviewTranscript } from "./InterviewTranscript";
import { MicGuidance } from "./MicGuidance";
import { useScreenRecording } from "@/hooks/useScreenRecording";
import { RecordingIndicator } from "./RecordingIndicator";

interface InterviewSessionProps {
  userId: string;
  jobDescription: string;
  totalQuestions: number;
  onComplete?: (sessionId: string) => void;
}

interface InterviewMessage {
  type: string;
  sessionId?: string;
  content?: string;
  audio?: string;
  currentQuestion?: number;
  totalQuestions?: number;
  isComplete?: boolean;
  isFinal?: boolean;
  error?: string;
}

export default function InterviewSession({
  userId,
  jobDescription,
  totalQuestions,
  onComplete,
}: InterviewSessionProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useAtom(userDataAtom);

  // Audio recording hook
  const {
    isRecording: isAudioRecording,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    uploadRecording,
    getAudioElement,
    error: recordingError,
  } = useScreenRecording();

  // Fetch user data
  const fetchUserData = async (): Promise<User> => {
    const { data } = await axios.get<User>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get/${userId}`
    );
    return data;
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    const socketInstance = io(`${backendUrl}/interview`, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to interview server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    socketInstance.on("interview_started", async (data: InterviewMessage) => {
      console.log("🎯 Interview started:", data);
      setSessionId(data.sessionId || null);
      setCurrentQuestion(data.currentQuestion || 1);
      setQuestionText(data.content || "");
      setIsGeneratingQuestions(false);

      // Start recording both mic + AI voices
      await startAudioRecording();
    });

    socketInstance.on("question_audio", async (data: InterviewMessage) => {
      console.log("🔊 Received question audio");
      setIsPlayingAudio(true);

      try {
        const audioBlob = base64ToBlob(data.audio || "", "audio/wav");
        const audioUrl = URL.createObjectURL(audioBlob);

        // Use pre-connected audio element from recording hook
        const recordingAudio = getAudioElement();
        const audio = recordingAudio || audioElementRef.current || new Audio();

        if (!audioElementRef.current && !recordingAudio) {
          audioElementRef.current = audio;
        }

        audio.src = audioUrl;
        await audio.play();

        audio.onended = () => {
          setIsPlayingAudio(false);
          startRecording();
        };
      } catch (error: any) {
        console.error("Error playing audio:", error);
        setIsPlayingAudio(false);
        startRecording();
      }
    });

    socketInstance.on("interim_transcript", (data: InterviewMessage) => {
      setTranscript(data.content || "");
    });

    socketInstance.on("next_question", (data: InterviewMessage) => {
      console.log("❓ Next question:", data.content);
      setCurrentQuestion(data.currentQuestion || 0);
      setQuestionText(data.content || "");
      setTranscript("");
    });

    socketInstance.on("interview_completed", async (data: InterviewMessage) => {
      console.log("🎉 Interview completed!");
      stopRecording();

      if (data.sessionId) {
        await stopAudioRecording();
        await uploadRecording(data.sessionId);
        onComplete?.(data.sessionId);
      }
    });

    socketInstance.on("interview_error", (data: InterviewMessage) => {
      console.error("❌ Interview error:", data.error);
      setError(data.error || "An error occurred");
    });

    setSocket(socketInstance);
    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
      stopRecording();
      stopAudioRecording();
    };
  }, [stopAudioRecording]);

  useEffect(() => {
    if (socket && isConnected && !sessionId) {
      console.log("🚀 Starting interview...");
      setIsGeneratingQuestions(true);

      socket.emit("start_interview", {
        userId,
        jobDescription,
        totalQuestions,
      });
    }
  }, [socket, isConnected, sessionId, userId, jobDescription, totalQuestions]);

  const startRecording = async () => {
    try {
      console.log("🎬 startRecording() called");

      if (!audioStreamRef.current) {
        console.log("🎤 Requesting microphone access...");

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        audioStreamRef.current = stream;
        console.log("✅ Microphone access granted");
      }

      if (
        !mediaRecorderRef.current ||
        mediaRecorderRef.current.state === "inactive"
      ) {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";

        const recorder = new MediaRecorder(audioStreamRef.current, {
          mimeType,
        });

        recorder.ondataavailable = (event) => {
          const currentSocket = socketRef.current;
          if (event.data.size > 0 && currentSocket) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Audio = (reader.result as string).split(",")[1];
              currentSocket.emit("audio_chunk", { audio: base64Audio });
            };
            reader.readAsDataURL(event.data);
          }
        };

        recorder.start(250);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      }
    } catch (error: any) {
      console.error("❌ Microphone error:", error);
      setError(
        "Microphone access denied. Please allow microphone access to continue."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    setIsRecording(false);
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const progressPercentage =
    totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 animate-fade-in">
      {/* Recording Indicator */}
      <RecordingIndicator isRecording={isAudioRecording} />

      {/* Participants */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-scale-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="relative rounded-2xl border border-black/10  [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] p-5">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <VoiceIndicator
            kind="ai"
            active={isPlayingAudio}
            label="AI Interviewer"
          />
        </div>
        <div className="relative rounded-2xl border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] p-5">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <VoiceIndicator
            kind="user"
            active={isRecording}
            label="You"
            userId={userData?.id}
            imageSrc={
              userData && userData.imageKey && userData.imageKey.length > 0
                ? userData.imageKey
                : "/assets/User.png"
            }
          />
        </div>
      </section>

      {/* Progress + question meta */}
      <InterviewProgress
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        isConnected={isConnected}
        progressPercentage={progressPercentage}
      />

      {/* Main content: Question + Live Transcript */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-scale-in"
        style={{ animationDelay: "0.3s" }}
      >
        <InterviewQuestion
          questionText={questionText}
          isGeneratingQuestions={isGeneratingQuestions}
        />
        <InterviewTranscript
          transcript={transcript}
          isRecording={isRecording}
        />
      </section>

      {/* Mic guidance */}
      <MicGuidance isRecording={isRecording} isPlayingAudio={isPlayingAudio} />

      {/* Error */}
      {(error || recordingError) && (
        <Card className="relative rounded-2xl border border-destructive/50 [background:linear-gradient(180deg,#ffebee_0%,#ffebee_60%,#ffcdd2_80%,#ef9a9a_100%)] animate-scale-in">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardContent className="pt-5">
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            {recordingError && (
              <p className="text-sm text-destructive font-medium">
                Recording Error: {recordingError}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
