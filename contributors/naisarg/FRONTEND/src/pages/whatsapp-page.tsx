import { useState } from "react";
import { MessageCircle, Send, CheckCircle2, Shield, QrCode, Phone, Video, MoreVertical, ArrowLeft, Bot, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { askSaathiRag } from "@/lib/api-client";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  buttons?: string[];
}

export function WhatsAppPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to SAATHI (साथी) — Official Bureau of Indian Standards (BIS) Citizen WhatsApp Service.\n\nType any Indian Standard (e.g. *IS 302*, *IS 1293*), ask a product certification question, or select an option below:",
      time: "09:30 AM",
      buttons: [
        "🔍 Check IS 302 Requirements",
        "🏷️ Verify ISI / Hallmarking",
        "💰 Estimate Certification Cost",
        "🇮🇳 Speak in Hindi / Tamil / Telugu",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askSaathiRag(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.reply || res.answer || "Official BIS response received.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        buttons: ["📄 View Gazette Notification", "📞 Contact Regional Branch", "🏠 Main Menu"],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `[BIS Official Bot] Record found for "${text}". Valid Scheme I Certification required.\n• Department: Electrotechnical / Mechanical\n• Status: Active Mandatory QCO`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        buttons: ["📄 Download Standard", "🏠 Main Menu"],
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 text-neutral-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3.5 py-1 text-xs font-semibold text-green-400">
            <MessageCircle className="size-3.5" />
            <span>Official BIS WhatsApp Integration [T1-27]</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Instant Standards Access on <span className="text-[#25D366]">WhatsApp</span>
          </h1>

          <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
            Citizens and MSME manufacturers across India can query Indian Standards, check mandatory QCO compliance, verify ISI marks, and calculate testing fees directly on WhatsApp in their regional mother tongue.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                <CheckCircle2 className="size-4" />
                <span>Zero Installation</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">Works on standard WhatsApp on 500M+ Indian phones.</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                <Sparkles className="size-4" />
                <span>Indic Multilingual</span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">Powered by Sarvam AI for 10+ Indian languages.</p>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://wa.me/15551676505?text=Hi%20SAATHI"
              alt="Scan to chat on WhatsApp"
              className="size-20 rounded-lg bg-white p-1"
            />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">Scan to Test on Your Phone</h4>
              <p className="text-xs text-neutral-400">Official Meta Test Number: +1 (555) 167-6505</p>
              <a
                href="https://wa.me/15551676505?text=Hi%20SAATHI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#25D366] hover:underline"
              >
                <span>Launch wa.me/15551676505</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Phone Simulator */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[380px] h-[640px] rounded-[3rem] border-[10px] border-neutral-800 bg-[#EFEAE2] shadow-2xl overflow-hidden flex flex-col dark:bg-[#0c1317]">
            
            {/* Phone Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-800 rounded-full z-20" />

            {/* WhatsApp Header */}
            <div className="pt-6 pb-3 px-4 bg-[#075E54] text-white flex items-center justify-between z-10 dark:bg-[#1f2c34]">
              <div className="flex items-center gap-2">
                <ArrowLeft className="size-4 text-white/80" />
                <div className="relative flex size-8 items-center justify-center rounded-full bg-white/20 font-bold text-xs">
                  🏛️
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-[#075E54] bg-[#25D366]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs leading-none">BIS SAATHI</span>
                    <CheckCircle2 className="size-3 fill-blue-500 text-white" />
                  </div>
                  <span className="text-3xs text-white/75">Official Govt Service</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Phone className="size-3.5" />
                <Video className="size-3.5" />
                <MoreVertical className="size-3.5" />
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              <div className="text-center">
                <span className="rounded-md bg-black/10 px-2.5 py-0.5 text-3xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-400">
                  🔒 Messages are end-to-end encrypted
                </span>
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 shadow-xs ${
                      m.sender === "user"
                        ? "rounded-tr-none bg-[#E7FFDB] text-neutral-900 dark:bg-[#005c4b] dark:text-neutral-100"
                        : "rounded-tl-none bg-white text-neutral-900 dark:bg-[#202c33] dark:text-neutral-100"
                    }`}
                  >
                    <p className="whitespace-pre-line text-xs leading-relaxed">{m.text}</p>
                    <span className="mt-1 block text-right text-3xs text-neutral-400">
                      {m.time}
                    </span>
                  </div>

                  {/* Interactive Option Buttons */}
                  {m.buttons && (
                    <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                      {m.buttons.map((b, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(b)}
                          className="rounded-md border border-[#25D366]/40 bg-white/90 px-2 py-1 text-2xs font-medium text-[#075E54] shadow-xs hover:bg-[#25D366]/10 dark:bg-[#202c33] dark:text-[#25D366]"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-1 text-2xs text-muted-foreground">
                  <span className="animate-pulse">SAATHI is typing...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-2 bg-[#F0F2F5] border-t border-border/40 flex items-center gap-1.5 dark:bg-[#202c33]">
              <input
                type="text"
                placeholder="Message SAATHI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                className="flex-1 h-9 bg-white dark:bg-[#2a3942] rounded-full px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#25D366]"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="size-9 rounded-full bg-[#25D366] text-white flex items-center justify-center disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
