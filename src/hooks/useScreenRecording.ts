import { useRef, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Constants
const AUDIO_CONFIG = {
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: 44100,
} as const;

const MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4",
] as const;

const CHUNK_INTERVAL_MS = 1000;

// Types
interface UseAudioRecordingReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  uploadRecording: (sessionId: string) => Promise<void>;
  getAudioElement: () => HTMLAudioElement | null;
  error: string | null;
}

interface MimeTypeInfo {
  finalMimeType: string;
  extension: string;
}

// Helper Functions
const getSupportedMimeType = (): string => {
  const supported = MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
  if (!supported) throw new Error("No supported audio MIME type found");
  return supported;
};

const getMimeTypeInfo = (recordedMimeType: string): MimeTypeInfo => {
  if (recordedMimeType.includes("mp4")) {
    return { finalMimeType: "video/mp4", extension: "mp4" };
  }
  if (recordedMimeType.includes("ogg")) {
    return { finalMimeType: "video/ogg", extension: "ogg" };
  }
  return { finalMimeType: "video/webm", extension: "webm" };
};

const handleUploadError = (err: any): void => {
  const status = err.response?.status;
  const errorMessage = err.response?.data?.message || err.response?.data?.error;

  switch (status) {
    case 413:
      toast.error("Recording file is too large to upload");
      break;
    case 404:
      toast.error("Upload endpoint not found");
      break;
    case 400:
      toast.error(`Upload failed: ${errorMessage || "Invalid request format"}`);
      break;
    default:
      toast.error(errorMessage || "Failed to upload recording");
  }
};

// Main Hook
export function useScreenRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const getAudioElement = useCallback(() => audioElementRef.current, []);

  const setupAudioMixer = async (): Promise<{
    audioContext: AudioContext;
    destination: MediaStreamAudioDestinationNode;
    audioElement: HTMLAudioElement;
  }> => {
    // Get microphone stream
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: AUDIO_CONFIG,
    });
    micStreamRef.current = micStream;

    // Create audio context and destination
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    
    audioContextRef.current = audioContext;
    destinationRef.current = destination;

    // Connect microphone
    const micSource = audioContext.createMediaStreamSource(micStream);
    micSource.connect(destination);

    // Create and connect persistent AI audio element
    const audioElement = new Audio();
    const aiSource = audioContext.createMediaElementSource(audioElement);
    aiSource.connect(destination); // For recording
    aiSource.connect(audioContext.destination); // For playback
    
    audioElementRef.current = audioElement;

    return { audioContext, destination, audioElement };
  };

  const startRecording = useCallback(async () => {
    try {
      console.log("🎬 Starting interview recording...");

      // Setup audio mixer
      const { destination } = await setupAudioMixer();
      console.log("✅ Audio mixer ready (mic + AI)");

      // Create MediaRecorder
      const supportedMimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: supportedMimeType,
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        setError("Recording error occurred");
        toast.error("Recording error occurred");
      };

      mediaRecorder.start(CHUNK_INTERVAL_MS);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);

      console.log("✅ Recording started - capturing both voices");
      toast.success("Recording interview");
    } catch (err: any) {
      console.error("❌ Failed to start recording:", err);
      setError(err.message || "Failed to start recording");

      const errorMessage = err.name === "NotAllowedError" 
        ? "Microphone permission denied" 
        : "Failed to start recording";
      toast.error(errorMessage);
    }
  }, []);

  const cleanup = useCallback(() => {
    // Stop microphone stream
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;

    // Close audio context
    if (audioContextRef.current?.state !== "closed") {
      audioContextRef.current?.close();
    }
    audioContextRef.current = null;
    destinationRef.current = null;
  }, []);

  const stopRecording = useCallback(async () => {
    return new Promise<void>((resolve) => {
      const recorder = mediaRecorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = () => {
          console.log("✅ Recording stopped");
          setIsRecording(false);
          cleanup();
          resolve();
        };
        recorder.stop();
      } else {
        setIsRecording(false);
        cleanup();
        resolve();
      }
    });
  }, [cleanup]);

  const uploadRecording = useCallback(async (sessionId: string) => {
    if (recordedChunksRef.current.length === 0) {
      console.warn("⚠️ No recording data to upload");
      toast.error("No recording data to upload");
      return;
    }

    try {
      // Prepare blob
      const recordedMimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
      const { finalMimeType, extension } = getMimeTypeInfo(recordedMimeType);
      const blob = new Blob(recordedChunksRef.current, { type: finalMimeType });

      // Prepare form data
      const formData = new FormData();
      formData.append("video", blob, `interview-${sessionId}.${extension}`);

      // Upload
      const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/interview/${sessionId}/upload-recording`;
      const uploadToast = toast.loading("Uploading interview recording...");

      console.log("📤 Uploading recording:", {
        sessionId,
        size: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
        type: finalMimeType,
      });

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            console.log(`📊 Upload: ${percent}%`);
          }
        },
      });

      toast.success("Interview recording uploaded successfully", { id: uploadToast });
      console.log("✅ Upload successful:", response.data);

      // Clear chunks
      recordedChunksRef.current = [];
    } catch (err: any) {
      console.error("❌ Upload failed:", err);
      handleUploadError(err);
      setError(err.message || "Failed to upload recording");
    }
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    uploadRecording,
    getAudioElement,
    error,
  };
}
