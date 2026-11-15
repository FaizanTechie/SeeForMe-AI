import React from "react";
import { FeatureTab, Language, AccessibilitySettings } from "../types";
import { Sparkles, BookOpen, Search, ShieldAlert, Mic, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { speakText } from "../utils/speech";

interface HeroLandingProps {
  setActiveTab: (tab: FeatureTab) => void;
  language: Language;
  settings: AccessibilitySettings;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ setActiveTab, language, settings }) => {
  const content = {
    en: {
      tagline: "Your eyes. Your AI. Your independence.",
      headline: "A visual assistant crafted for absolute clarity and confidence.",
      description: "Empower your daily independence with real-time Gemini AI vision. Capture surroundings, read documents instantly, locate misplaced items, and navigate safely with natural voice guidance.",
      primaryAction: "Start Seeing with AI",
      featuresTitle: "Core Assistance Capabilities",
      features: [
        { id: "vision", title: "AI Vision", desc: "Instantly capture and receive detailed surroundings descriptions.", icon: Sparkles },
        { id: "read", title: "Read Text", desc: "Scan books, signs, menus, and documents with text-to-speech.", icon: BookOpen },
        { id: "find", title: "Find Objects", desc: "Locate keys, phones, bags, and bottles with directional guidance.", icon: Search },
        { id: "safety", title: "Safety Assistant", desc: "Identify visible obstacles, steps, and hazards for safe travel.", icon: ShieldAlert },
        { id: "voice", title: "Voice Assistant", desc: "Natural conversational voice interaction with spoken responses.", icon: Mic },
      ],
      trustPoints: ["Real-time Gemini AI", "Multi-language (English, Urdu, Pashto)", "High contrast & screen reader ready"],
    },
    ur: {
      tagline: "آپ کی آنکھیں، آپ کا اے آئی، آپ کی آزادی۔",
      headline: "مڪمل وضاحت اور خود اعتمادی کے لیے ڈیزائن کردہ ویژول اسسٹنٹ۔",
      description: "جیمنی اے آئی ویژن کے ساتھ اپنی روزمرہ کی خودمختاری کو بااختیار بنائیں۔ اپنے اردگرد کا ماحول دیکھئے، دستاویزات فوری پڑھیں، گم شدہ اشیاء تلاش کریں، اور آواز کی رہنمائی سے محفوظ سفر کریں۔",
      primaryAction: "دیکھنا شروع کریں",
      featuresTitle: "بنیادی معاون خصوصیات",
      features: [
        { id: "vision", title: "اے آئی ویژن", desc: "فوری طور پر اردگرد کے ماحول کی تفصیل حاصل کریں۔", icon: Sparkles },
        { id: "read", title: "متن پڑھیں", desc: "کتابوں، سائن بورڈز اور دستاویزات کو آواز کے ساتھ اسکین کریں۔", icon: BookOpen },
        { id: "find", title: "چیزیں تلاش کریں", desc: "چابیاں، فون اور دیگر اشیاء کو سمت کی رہنمائی کے ساتھ تلاش کریں۔", icon: Search },
        { id: "safety", title: "حفاظتی اسسٹنٹ", desc: "رکاوٹوں اور خطرات کی نشاندہی کریں۔", icon: ShieldAlert },
        { id: "voice", title: "وائس اسسٹنٹ", desc: "آواز کے ذریعے فطری بات چیت۔", icon: Mic },
      ],
      trustPoints: ["حقیقی وقت کا جیمنی اے آئی", "کثیر لسانی معاونت (انگریزی، اردو، پشتو)", "ہائی کنٹراسٹ اور اسکرین ریڈر سپورٹ"],
    },
    ps: {
      tagline: "ستاسو سترګې. ستاسو AI. ستاسو خپلواکي.",
      headline: "د بشپړ روښانتیا او ډاډ لپاره جوړ شوی لید مرستیال.",
      description: "د جیمني AI لید سره خپله ورځنۍ خپلواکي پیاوړې کړئ. شاوخوا چاپېریال وڅیړئ، اسناد په چټکۍ سره ولولئ، ورک شوي شیان ومومئ، او د غږیز لارښوونې سره په خوندي توګه سفر وکړئ.",
      primaryAction: "د AI سره لیدل پیل کړئ",
      featuresTitle: "اساسي مرستندویه ځانګړتیاوې",
      features: [
        { id: "vision", title: "AI لید", desc: "د شاوخوا چاپېریال تفصیلي توضیحات ترلاسه کړئ.", icon: Sparkles },
        { id: "read", title: "متن لوستل", desc: "کتابونه، نښې او اسناد په لوړ غږ لوستل.", icon: BookOpen },
        { id: "find", title: "شیان موندل", desc: "کیلي، تلیفون او نور شیان د سمتي لارښوونې سره ومومئ.", icon: Search },
        { id: "safety", title: "خوندیتوب مرستیال", desc: "خطرناک خنډونه او زینه وپیژنئ.", icon: ShieldAlert },
        { id: "voice", title: "غږیز مرستیال", desc: "د غږ له لارې طبیعي خبرې اترې.", icon: Mic },
      ],
      trustPoints: ["حقیقي وخت جیمني AI", "څو ژبې (انګلیسي، اردو، پښتو)", "د لوړ کنټراسٹ او سکرین لوستونکي ملاتړ"],
    },
  };

  const t = content[language];
  const isRtl = language === "ur" || language === "ps";

  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 md:py-20 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-[#E8EFE9] text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tagline}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#202321] dark:text-[#F8F8F5] mb-6 leading-tight">
          {t.headline}
        </h1>
        <p className="text-lg md:text-xl text-[#858A86] dark:text-white/70 mb-10 leading-relaxed">
          {t.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setActiveTab("vision");
              if (settings.voiceFeedback) speakText("Opening AI Vision camera", language, settings.speechRate);
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#426B58] hover:bg-[#345546] text-white font-medium text-base flex items-center justify-center gap-3 shadow-lg shadow-[#426B58]/25 transition-all focus:ring-4 focus:ring-[#426B58]/40"
            aria-label={t.primaryAction}
          >
            <Eye className="w-5 h-5" />
            <span>{t.primaryAction}</span>
            <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs font-medium text-[#858A86] dark:text-white/60">
          {t.trustPoints.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#426B58]" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-[#202321] dark:text-[#F8F8F5] mb-8 text-center">
          {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => {
                  setActiveTab(feat.id as FeatureTab);
                  if (settings.voiceFeedback) speakText(`Opening ${feat.title}`, language, settings.speechRate);
                }}
                className="group text-left p-8 rounded-3xl bg-white dark:bg-white/5 border border-[#202321]/10 dark:border-white/10 hover:border-[#426B58] dark:hover:border-[#426B58] transition-all hover:shadow-xl shadow-xs flex flex-col justify-between"
                aria-label={feat.title}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E8EFE9] dark:bg-white/10 text-[#426B58] dark:text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#202321] dark:text-[#F8F8F5] mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#858A86] dark:text-white/70 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#426B58] dark:text-[#E8EFE9] group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
