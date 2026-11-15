import { Language } from "../types";

export function speakText(text: string, language: Language = "en", rate: number = 1.0) {
  if (!("speechSynthesis" in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Select appropriate voice based on language
  const voices = window.speechSynthesis.getVoices();
  let langCode = "en-US";
  if (language === "ur") langCode = "ur-PK";
  if (language === "ps") langCode = "ps-AF";

  const targetVoice = voices.find(v => v.lang.startsWith(language) || v.lang.startsWith(langCode));
  if (targetVoice) {
    utterance.voice = targetVoice;
  }
  utterance.lang = langCode;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
