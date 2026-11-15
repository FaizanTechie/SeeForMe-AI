import React from "react";
import { FeatureTab, Language, AccessibilitySettings } from "../types";
import { Eye, Volume2, Globe, Settings, ShieldAlert, Sparkles, BookOpen, Search, Mic } from "lucide-react";
import { speakText } from "../utils/speech";

interface HeaderProps {
  activeTab: FeatureTab;
  setActiveTab: (tab: FeatureTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  settings,
  setSettings,
}) => {
  const translations = {
    en: {
      title: "SeeForMe AI",
      vision: "Vision",
      read: "Read Text",
      find: "Find Object",
      safety: "Safety",
      voice: "Voice AI",
      settings: "Settings",
    },
    ur: {
      title: "SeeForMe AI",
      vision: "بینائی",
      read: "مت پڑھیں",
      find: "چیز تلاش کریں",
      safety: "حفاظت",
      voice: "وائس اسسٹنٹ",
      settings: "ترتیبات",
    },
    ps: {
      title: "SeeForMe AI",
      vision: "لید",
      read: "متن لوستل",
      find: "شی ومومئ",
      safety: "خوندیتوب",
      voice: "غږیز مرستیال",
      settings: "تنظیمات",
    },
  };

  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 bg-[#F8F8F5]/90 dark:bg-[#202321]/90 backdrop-blur-md border-b border-[#202321]/10 dark:border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => {
            setActiveTab("home");
            if (settings.voiceFeedback) speakText("SeeForMe AI Home", language, settings.speechRate);
          }}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-[#426B58] rounded-xl p-1"
          aria-label="SeeForMe AI Home"
        >
          <div className="w-10 h-10 rounded-xl bg-[#426B58] text-white flex items-center justify-center shadow-sm">
            <Eye className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-[#202321] dark:text-[#F8F8F5] block">
              {t.title}
            </span>
            <span className="text-[11px] text-[#858A86] font-medium tracking-wide block">
              Visual Assistant
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#E8EFE9] dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("vision")}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "vision"
                ? "bg-white dark:bg-[#426B58] text-[#202321] dark:text-white shadow-xs"
                : "text-[#202321]/70 dark:text-white/70 hover:text-[#202321]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#426B58] dark:text-white" />
            {t.vision}
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "read"
                ? "bg-white dark:bg-[#426B58] text-[#202321] dark:text-white shadow-xs"
                : "text-[#202321]/70 dark:text-white/70 hover:text-[#202321]"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#426B58] dark:text-white" />
            {t.read}
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "find"
                ? "bg-white dark:bg-[#426B58] text-[#202321] dark:text-white shadow-xs"
                : "text-[#202321]/70 dark:text-white/70 hover:text-[#202321]"
            }`}
          >
            <Search className="w-4 h-4 text-[#426B58] dark:text-white" />
            {t.find}
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "safety"
                ? "bg-white dark:bg-[#426B58] text-[#202321] dark:text-white shadow-xs"
                : "text-[#202321]/70 dark:text-white/70 hover:text-[#202321]"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#426B58] dark:text-white" />
            {t.safety}
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "voice"
                ? "bg-white dark:bg-[#426B58] text-[#202321] dark:text-white shadow-xs"
                : "text-[#202321]/70 dark:text-white/70 hover:text-[#202321]"
            }`}
          >
            <Mic className="w-4 h-4 text-[#426B58] dark:text-white" />
            {t.voice}
          </button>
        </nav>

        {/* Controls: Language & Accessibility */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#E8EFE9] dark:bg-white/5 rounded-xl p-1">
            <Globe className="w-4 h-4 text-[#426B58] dark:text-white ml-2" aria-hidden="true" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-medium text-[#202321] dark:text-white py-1.5 px-2 focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              <option value="en" className="bg-[#F8F8F5] text-[#202321]">English</option>
              <option value="ur" className="bg-[#F8F8F5] text-[#202321]">اردو (Urdu)</option>
              <option value="ps" className="bg-[#F8F8F5] text-[#202321]">پښتو (Pashto)</option>
            </select>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`p-2.5 rounded-xl transition-colors flex items-center justify-center ${
              activeTab === "settings"
                ? "bg-[#426B58] text-white"
                : "bg-[#E8EFE9] dark:bg-white/5 text-[#202321] dark:text-white hover:bg-[#426B58]/20"
            }`}
            aria-label="Accessibility Settings"
            title="Accessibility Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
