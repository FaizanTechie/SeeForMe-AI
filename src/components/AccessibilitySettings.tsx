import React from "react";
import { Language, AccessibilitySettings } from "../types";
import { Settings, Eye, Volume2, ArrowLeft, Check } from "lucide-react";
import { speakText } from "../utils/speech";

interface AccessibilitySettingsProps {
  language: Language;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onBack: () => void;
}

export const AccessibilitySettingsView: React.FC<AccessibilitySettingsProps> = ({
  language,
  settings,
  setSettings,
  onBack,
}) => {
  const isRtl = language === "ur" || language === "ps";

  return (
    <div className={`max-w-3xl mx-auto px-6 py-10 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#426B58] dark:text-[#E8EFE9] mb-8 hover:underline"
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
        <span>Back to Home</span>
      </button>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-[#E8EFE9] text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5" />
          <span>Accessibility Preferences</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#202321] dark:text-[#F8F8F5] mb-3">
          Customized Accessibility
        </h1>
        <p className="text-sm md:text-base text-[#858A86] dark:text-white/70">
          Tailor SeeForMe AI to your sensory and visual needs for effortless interaction.
        </p>
      </div>

      <div className="space-y-6">
        {/* High Contrast */}
        <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[#202321] dark:text-[#F8F8F5] mb-1 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#426B58]" />
              <span>High Contrast Mode</span>
            </h2>
            <p className="text-sm text-[#858A86] dark:text-white/70">
              Enhance visibility with maximum contrast black and white theme.
            </p>
          </div>
          <button
            onClick={() => {
              const next = !settings.highContrast;
              setSettings((prev) => ({ ...prev, highContrast: next }));
              if (settings.voiceFeedback) speakText(next ? "High contrast enabled" : "High contrast disabled", language, settings.speechRate);
            }}
            className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center ${
              settings.highContrast ? "bg-[#426B58]" : "bg-gray-300 dark:bg-white/20"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.highContrast ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Voice Feedback */}
        <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[#202321] dark:text-[#F8F8F5] mb-1 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#426B58]" />
              <span>Spoken Voice Feedback</span>
            </h2>
            <p className="text-sm text-[#858A86] dark:text-white/70">
              Automatically read AI responses and navigation actions aloud.
            </p>
          </div>
          <button
            onClick={() => {
              const next = !settings.voiceFeedback;
              setSettings((prev) => ({ ...prev, voiceFeedback: next }));
              if (next) speakText("Voice feedback enabled", language, settings.speechRate);
            }}
            className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center ${
              settings.voiceFeedback ? "bg-[#426B58]" : "bg-gray-300 dark:bg-white/20"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                settings.voiceFeedback ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Speech Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 shadow-xs">
          <h2 className="text-lg font-bold text-[#202321] dark:text-[#F8F8F5] mb-1 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#426B58]" />
            <span>Speech Reading Speed</span>
          </h2>
          <p className="text-sm text-[#858A86] dark:text-white/70 mb-4">
            Adjust how fast the assistant speaks descriptions aloud.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[0.8, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setSettings((prev) => ({ ...prev, speechRate: rate }));
                  if (settings.voiceFeedback) speakText(`Speech speed ${rate}x`, language, rate);
                }}
                className={`py-3 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  settings.speechRate === rate
                    ? "bg-[#426B58] text-white"
                    : "bg-[#E8EFE9] dark:bg-white/10 text-[#202321] dark:text-white hover:bg-[#426B58]/20"
                }`}
              >
                {settings.speechRate === rate && <Check className="w-4 h-4" />}
                <span>{rate}x Speed</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Scale */}
        <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 shadow-xs">
          <h2 className="text-lg font-bold text-[#202321] dark:text-[#F8F8F5] mb-1 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#426B58]" />
            <span>Text Size Scaling</span>
          </h2>
          <p className="text-sm text-[#858A86] dark:text-white/70 mb-4">
            Choose comfortable reading font size.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Normal", scale: 1.0 },
              { label: "Large", scale: 1.2 },
              { label: "Extra Large", scale: 1.4 },
            ].map((item) => (
              <button
                key={item.scale}
                onClick={() => {
                  setSettings((prev) => ({ ...prev, fontSizeScale: item.scale }));
                  if (settings.voiceFeedback) speakText(`${item.label} text selected`, language, settings.speechRate);
                }}
                className={`py-3 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  settings.fontSizeScale === item.scale
                    ? "bg-[#426B58] text-white"
                    : "bg-[#E8EFE9] dark:bg-white/10 text-[#202321] dark:text-white hover:bg-[#426B58]/20"
                }`}
              >
                {settings.fontSizeScale === item.scale && <Check className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
