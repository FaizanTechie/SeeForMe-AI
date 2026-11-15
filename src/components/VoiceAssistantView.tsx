import React, { useState, useEffect, useRef } from "react";
import { Language, AccessibilitySettings, ChatMessage } from "../types";
import { Mic, Send, Volume2, ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { speakText, stopSpeech } from "../utils/speech";

interface VoiceAssistantViewProps {
  language: Language;
  settings: AccessibilitySettings;
  onBack: () => void;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({ language, settings, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: language === "ur" 
        ? "السلام علیکم! میں SeeForMe AI ہوں۔ آپ کو کس چیز میں مدد چاہیے؟"
        : language === "ps"
        ? "سلام! زه SeeForMe AI یم. تاسو سره په څه کې مرسته کولی شم؟"
        : "Hello! I am SeeForMe AI, your dedicated visual and personal assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (settings.voiceFeedback && messages.length === 1) {
      speakText(messages[0].content, language, settings.speechRate);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get AI response");

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (settings.voiceFeedback) {
        speakText(data.text, language, settings.speechRate);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, I am having trouble connecting right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ur" ? "ur-PK" : language === "ps" ? "ps-AF" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      if (settings.voiceFeedback) speakText("Listening...", language, settings.speechRate);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const isRtl = language === "ur" || language === "ps";

  return (
    <div className={`max-w-4xl mx-auto px-6 py-10 flex flex-col h-[85vh] ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#426B58] dark:text-[#E8EFE9] mb-4 hover:underline shrink-0"
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
        <span>Back to Home</span>
      </button>

      <div className="mb-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-[#E8EFE9] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Voice Assistant</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#202321] dark:text-[#F8F8F5]">
          Conversational Voice AI
        </h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 space-y-4 mb-4 shadow-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm md:text-base ${
                msg.role === "user"
                  ? "bg-[#426B58] text-white rounded-br-xs"
                  : "bg-[#E8EFE9] dark:bg-white/10 text-[#202321] dark:text-white rounded-bl-xs"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[11px] font-semibold opacity-70">
                  {msg.role === "user" ? "You" : "SeeForMe AI"}
                </span>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => speakText(msg.content, language, settings.speechRate)}
                    className="p-1 hover:bg-black/10 rounded"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-[#E8EFE9] dark:bg-white/10 text-[#202321] dark:text-white flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-[#426B58]" />
              <span className="text-sm font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={startVoiceInput}
          className={`p-4 rounded-2xl transition-all flex items-center justify-center ${
            isListening
              ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30"
              : "bg-[#426B58] text-white hover:bg-[#345546] shadow-md shadow-[#426B58]/20"
          }`}
          title="Speak to Assistant"
          aria-label="Speak to Assistant"
        >
          <Mic className="w-6 h-6" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isListening ? "Listening..." : "Type your question here..."}
          className="flex-1 px-5 py-4 rounded-2xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 text-[#202321] dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-[#426B58] shadow-xs"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-4 rounded-2xl bg-[#426B58] text-white hover:bg-[#345546] disabled:opacity-50 transition-all flex items-center justify-center shadow-md shadow-[#426B58]/20"
          aria-label="Send Message"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
