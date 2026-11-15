/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FeatureTab, Language, AccessibilitySettings } from "./types";
import { Header } from "./components/Header";
import { HeroLanding } from "./components/HeroLanding";
import { VisionModal } from "./components/VisionModal";
import { ReadTextView } from "./components/ReadTextView";
import { FindObjectsView } from "./components/FindObjectsView";
import { SafetyAssistantView } from "./components/SafetyAssistantView";
import { VoiceAssistantView } from "./components/VoiceAssistantView";
import { AccessibilitySettingsView } from "./components/AccessibilitySettings";
import { Footer } from "./components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSizeScale: 1.0,
    speechRate: 1.0,
    voiceFeedback: true,
  });

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        settings.highContrast ? "high-contrast bg-black text-white" : "bg-[#F8F8F5] text-[#202321]"
      }`}
      style={{ fontSize: `${settings.fontSizeScale * 100}%` }}
    >
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        settings={settings}
        setSettings={setSettings}
      />

      <main className="flex-1">
        {activeTab === "home" && (
          <HeroLanding setActiveTab={setActiveTab} language={language} settings={settings} />
        )}
        {activeTab === "vision" && (
          <VisionModal language={language} settings={settings} onBack={() => setActiveTab("home")} />
        )}
        {activeTab === "read" && (
          <ReadTextView language={language} settings={settings} onBack={() => setActiveTab("home")} />
        )}
        {activeTab === "find" && (
          <FindObjectsView language={language} settings={settings} onBack={() => setActiveTab("home")} />
        )}
        {activeTab === "safety" && (
          <SafetyAssistantView language={language} settings={settings} onBack={() => setActiveTab("home")} />
        )}
        {activeTab === "voice" && (
          <VoiceAssistantView language={language} settings={settings} onBack={() => setActiveTab("home")} />
        )}
        {activeTab === "settings" && (
          <AccessibilitySettingsView
            language={language}
            settings={settings}
            setSettings={setSettings}
            onBack={() => setActiveTab("home")}
          />
        )}
      </main>

      <Footer language={language} />
    </div>
  );
}
