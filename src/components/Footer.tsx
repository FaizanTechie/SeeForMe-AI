import React from "react";
import { Eye } from "lucide-react";
import { Language } from "../types";

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isRtl = language === "ur" || language === "ps";

  return (
    <footer className={`border-t border-[#202321]/10 dark:border-white/10 mt-20 py-12 bg-white/50 dark:bg-black/20 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#426B58] text-white flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#202321] dark:text-[#F8F8F5]">SeeForMe AI</span>
            <span className="text-xs text-[#858A86] block">Your eyes. Your AI. Your independence.</span>
          </div>
        </div>

        <div className="text-xs text-[#858A86] dark:text-white/50 text-center md:text-right">
          <p>© {new Date().getFullYear()} SeeForMe AI. Designed for absolute accessibility and independence.</p>
        </div>
      </div>
    </footer>
  );
};
