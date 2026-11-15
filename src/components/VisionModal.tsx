import React, { useState, useRef, useEffect } from "react";
import { Language, AccessibilitySettings } from "../types";
import { Camera, Upload, Volume2, Square, Sparkles, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { speakText, stopSpeech } from "../utils/speech";

interface VisionModalProps {
  language: Language;
  settings: AccessibilitySettings;
  onBack: () => void;
}

export const VisionModal: React.FC<VisionModalProps> = ({ language, settings, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (settings.voiceFeedback) {
      speakText(
        language === "ur" ? "اے آئی ویژن کیمرہ تیار ہے۔ تصویر کھینچیں یا اپ لوڈ کریں۔" :
        language === "ps" ? "د AI لید کیمره چمتو ده. عکس واخلئ یا پورته کړئ." :
        "AI Vision ready. Capture or upload an image to describe surroundings.",
        language,
        settings.speechRate
      );
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
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please upload an image instead.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
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
    analyzeImage(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
      stopCamera();
      analyzeImage(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imgData: string, promptText?: string) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imgData,
          prompt: promptText || customPrompt,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      setAnalysisResult(data.text);
      if (settings.voiceFeedback) {
        speakText(data.text, language, settings.speechRate);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image with Gemini AI.");
    } finally {
      setLoading(false);
    }
  };

  const isRtl = language === "ur" || language === "ps";

  return (
    <div className={`max-w-4xl mx-auto px-6 py-10 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#426B58] dark:text-[#E8EFE9] mb-8 hover:underline"
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-[#E8EFE9] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Vision</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#202321] dark:text-[#F8F8F5] mb-3">
          {language === "ur" ? "اے آئی ویژن ماحول کی شناخت" : language === "ps" ? "د AI لید چاپېریال پیژندنه" : "AI Vision Surroundings"}
        </h1>
        <p className="text-sm md:text-base text-[#858A86] dark:text-white/70">
          {language === "ur" ? "اپنے کیمرے سے تصویر لیں یا اپ لوڈ کریں اور جیمنی سے فوری صوتی تفصیل سنیں۔" : language === "ps" ? "خپل کیمره وکاروئ یا عکس پورته کړئ او د جیمني صوتی توضیحات واورئ." : "Capture or upload an image to receive a rich, descriptive analysis of your surroundings."}
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Camera / Image Viewport */}
      <div className="rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 overflow-hidden shadow-sm mb-8">
        <div className="relative aspect-video bg-[#202321] flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
          ) : image ? (
            <img src={image} alt="Captured scene" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <Camera className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-sm text-white/70 font-medium">Camera is inactive. Click below to start camera or upload.</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls bar */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-[#F8F8F5] dark:bg-black/20 border-t border-[#202321]/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-6 py-3 rounded-xl bg-[#426B58] text-white font-medium text-sm flex items-center gap-2 hover:bg-[#345546] shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera</span>
              </button>
            ) : (
              <>
                <button
                  onClick={captureSnapshot}
                  className="px-6 py-3 rounded-xl bg-[#426B58] text-white font-medium text-sm flex items-center gap-2 hover:bg-[#345546] shadow-sm animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Capture & Analyze</span>
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

            <label className="px-6 py-3 rounded-xl bg-white dark:bg-white/10 border border-[#202321]/10 dark:border-white/20 text-[#202321] dark:text-white font-medium text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {image && !cameraActive && (
            <button
              onClick={() => {
                setImage(null);
                setAnalysisResult(null);
                startCamera();
              }}
              className="px-4 py-3 rounded-xl bg-gray-200 dark:bg-white/10 text-[#202321] dark:text-white font-medium text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Take Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="mb-8 p-6 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10">
        <label className="block text-sm font-semibold text-[#202321] dark:text-[#F8F8F5] mb-2">
          Ask a specific question about the scene (Optional)
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., Is there a chair nearby? What color is the door?"
            className="flex-1 px-4 py-3 rounded-xl bg-[#F8F8F5] dark:bg-black/30 border border-[#202321]/10 dark:border-white/10 text-[#202321] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#426B58]"
          />
          {image && (
            <button
              onClick={() => analyzeImage(image, customPrompt)}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#426B58] text-white font-medium text-sm hover:bg-[#345546] disabled:opacity-50"
            >
              Ask AI
            </button>
          )}
        </div>
      </div>

      {/* Analysis Result */}
      {(loading || analysisResult) && (
        <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#202321] dark:text-[#F8F8F5] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#426B58]" />
              <span>AI Surroundings Description</span>
            </h2>
            {analysisResult && (
              <button
                onClick={() => speakText(analysisResult, language, settings.speechRate)}
                className="px-4 py-2 rounded-xl bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#426B58] hover:text-white transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat Audio</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-[#426B58] mx-auto mb-4" />
              <p className="text-sm font-medium text-[#858A86]">Analyzing image with Gemini AI...</p>
            </div>
          ) : (
            <div className="text-base text-[#202321] dark:text-white/90 leading-relaxed whitespace-pre-wrap font-medium">
              {analysisResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
