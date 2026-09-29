import { useState } from "react";
import { MessageCircle, X, ExternalLink, QrCode, CheckCircle2, Send, Bot, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { askSaathiRag } from "@/lib/api-client";

interface WhatsAppMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  buttons?: string[];
}

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"simulator" | "qr">("simulator");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! 🙏 I am SAATHI, the official Bureau of Indian Standards (BIS) WhatsApp Assistant.\n\nHow can I help you today?",
      time: "10:30 AM",
      buttons: ["1️⃣ Check IS 302 Standard", "2️⃣ Verify ISI / Hallmarking", "3️⃣ Track Application", "4️⃣ Speak in Hindi"],
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: WhatsAppMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askSaathiRag(query);
      const botMsg: WhatsAppMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.reply || res.answer || "Official BIS response received.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        buttons: ["🔍 More Details", "📞 Talk to Officer", "🏠 Main Menu"],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg: WhatsAppMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `[BIS Official Bot] Found details for: "${query}". All products under this category require valid BIS Scheme I certification.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        buttons: ["📄 Download Gazette", "🏠 Main Menu"],
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl shadow-green-600/30 transition-all hover:bg-[#20bd5a] hover:shadow-green-600/50"
              aria-label="Chat with SAATHI on WhatsApp"
            >
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-white" />
              </span>
              <MessageCircle className="size-5 fill-white text-[#25D366]" />
              <span className="text-sm font-semibold tracking-wide">WhatsApp Bot</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Modal / Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex h-[580px] w-[370px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-[#EFEAE2] shadow-2xl dark:bg-[#0c1317] dark:border-neutral-800"
            >
              {/* WhatsApp Header */}
              <div className="flex items-center justify-between bg-[#075E54] px-4 py-3 text-white dark:bg-[#1f2c34]">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex size-9 items-center justify-center rounded-full bg-white/10 text-white font-bold text-sm">
                    🏛️
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm">BIS SAATHI</span>
                      <CheckCircle2 className="size-3.5 fill-blue-500 text-white" />
                    </div>
                    <span className="text-2xs text-white/80">Official Govt Bot • Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab(activeTab === "simulator" ? "qr" : "simulator")}
                    className="rounded-full p-1.5 hover:bg-white/10 text-white/90 transition-colors"
                    title={activeTab === "simulator" ? "Show QR Code" : "Show Simulator"}
                  >
                    {activeTab === "simulator" ? <QrCode className="size-4" /> : <Bot className="size-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 hover:bg-white/10 text-white/90 transition-colors"
                    aria-label="Close WhatsApp widget"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* QR Code Tab */}
              {activeTab === "qr" ? (
                <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-card">
                  <div className="rounded-xl border-4 border-[#25D366] bg-white p-4 shadow-lg">
                    {/* Visual QR Code Generator */}
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://wa.me/15551676505?text=Hi%20SAATHI%20BIS%20Assistant"
                      alt="WhatsApp QR Code"
                      className="size-40"
                    />
                  </div>
                  <h4 className="mt-4 font-semibold text-foreground text-sm">Scan with your Phone</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Chat with official Meta test number: +1 (555) 167-6505
                  </p>
                  <a
                    href="https://wa.me/15551676505?text=Hi%20SAATHI"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#20bd5a]"
                  >
                    <span>Open in WhatsApp Web</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              ) : (
                /* Interactive Simulator Chat Tab */
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto p-3 text-xs">
                    <div className="text-center">
                      <span className="rounded-md bg-black/10 px-2 py-0.5 text-3xs font-medium text-foreground/70 dark:bg-white/10">
                        TODAY • END-TO-END ENCRYPTED
                      </span>
                    </div>

                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
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

                        {/* Interactive Buttons */}
                        {m.buttons && m.buttons.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                            {m.buttons.map((b, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(b)}
                                className="rounded-md border border-[#25D366]/40 bg-white/90 px-2.5 py-1 text-2xs font-medium text-[#075E54] shadow-xs hover:bg-[#25D366]/10 dark:bg-[#202c33] dark:text-[#25D366]"
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {loading && (
                      <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                        <span className="animate-pulse">SAATHI is typing...</span>
                      </div>
                    )}
                  </div>

                  {/* Input Bar */}
                  <div className="flex items-center gap-1.5 border-t border-border/50 bg-[#F0F2F5] p-2 dark:bg-[#202c33]">
                    <input
                      type="text"
                      placeholder="Type a message or IS standard..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                      className="h-9 flex-1 rounded-full border-0 bg-white px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#25D366] dark:bg-[#2a3942]"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || loading}
                      className="flex size-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity disabled:opacity-40"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
