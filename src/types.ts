export type Language = "en" | "ur" | "ps";

export type FeatureTab = "home" | "vision" | "read" | "find" | "safety" | "voice" | "settings";

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSizeScale: number; // 1, 1.25, 1.5
  speechRate: number; // 0.8, 1, 1.2
  voiceFeedback: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
