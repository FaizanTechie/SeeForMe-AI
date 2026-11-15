import React, { useState, useRef, useEffect } from "react";
import { Language, AccessibilitySettings } from "../types";
import { ShieldAlert, Camera, Upload, Volume2, Square, RefreshCw, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { speakText, stopSpeech } from "../utils/speech";

interface SafetyAssistantViewProps {
  language: Language;
  settings: AccessibilitySettings;
  onBack: () => void;
}

export const SafetyAssistantView: React.FC<SafetyAssistantViewProps> = ({ language, settings, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [safetyReport, setSafetyReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (settings.voiceFeedback) {
      speakText("Safety Assistant ready. Scan surroundings to identify visible hazards, steps, or obstacles.", language, settings.speechRate);
    }
    return () => {
      stopSpeech();
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to access camera. Please upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureAndCheckSafety = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImage(dataUrl);
    stopCamera();
    checkSafety(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setImage(res);
      stopCamera();
      checkSafety(res);
    };
    reader.readAsDataURL(file);
  };

  const checkSafety = async (imgData: string) => {
    setLoading(true);
    setError(null);
    setSafetyReport(null);

    try {
      const response = await fetch("/api/safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData, language }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Safety analysis failed");

      setSafetyReport(data.text);
      if (settings.voiceFeedback) {
        speakText(data.text, language, settings.speechRate);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze safety hazards.");
    } finally {
      setLoading(false);
    }
  };

  const isRtl = language === "ur" || language === "ps";

  return (
    <div className={`max-w-4xl mx-auto px-6 py-10 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#426B58] dark:text-[#E8EFE9] mb-8 hover:underline"
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
        <span>Back to Home</span>
      </button>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety & Hazard Assistant</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#202321] dark:text-[#F8F8F5] mb-3">
          Obstacle & Hazard Detection
        </h1>
        <p className="text-sm md:text-base text-[#858A86] dark:text-white/70">
          Scan your pathway to instantly detect steps, uneven flooring, wet surfaces, or protruding hazards.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 overflow-hidden shadow-sm mb-8">
        <div className="relative aspect-video bg-[#202321] flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
          ) : image ? (
            <img src={image} alt="Safety scan" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <ShieldAlert className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <p className="text-sm text-white/70 font-medium">Point camera ahead to scan for hazards.</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-[#F8F8F5] dark:bg-black/20 border-t border-[#202321]/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-xl bg-amber-700 text-white font-medium text-sm flex items-center gap-2 hover:bg-amber-800"
              >
                <Camera className="w-4 h-4" />
                <span>Start Safety Scan</span>
              </button>
            ) : (
              <>
                <button
                  onClick={captureAndCheckSafety}
                  className="px-6 py-3 rounded-xl bg-amber-700 text-white font-medium text-sm flex items-center gap-2 hover:bg-amber-800 animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Hazards</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-3 rounded-xl bg-gray-200 dark:bg-white/10 text-[#202321] dark:text-white font-medium text-sm flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              </>
            )}

            <label className="px-6 py-3 rounded-xl bg-white dark:bg-white/10 border border-[#202321]/10 text-[#202321] dark:text-white font-medium text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {(loading || safetyReport) && (
        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#202321] dark:text-[#F8F8F5] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Safety Assessment</span>
            </h2>
            {safetyReport && (
              <button
                onClick={() => speakText(safetyReport, language, settings.speechRate)}
                className="px-4 py-2 rounded-xl bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#426B58] hover:text-white"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat Warning</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
              <p className="text-sm font-medium text-[#858A86]">Checking for hazards...</p>
            </div>
          ) : (
            <div className="text-base text-[#202321] dark:text-white/90 leading-relaxed whitespace-pre-wrap font-medium p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
              {safetyReport}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
