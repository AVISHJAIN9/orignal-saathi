import { useState, useRef, useEffect } from 'react';
import { pipeline, env } from '@huggingface/transformers';
import { Download, Mic, MicOff, Volume2, VolumeX, Bot, User, CheckSquare, Square, Send, Sparkles } from 'lucide-react';

// Force Transformers.js to strictly use local files
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = '/models/';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AVAILABLE_DOCS = [
  { id: "factory_layout", label: "Factory Layout & Machinery List (15%)" },
  { id: "test_equipment", label: "Clause-Specific In-House Test Benches (20%)" },
  { id: "calibration_certs", label: "Valid NABL Calibration Certs (10%)" },
  { id: "qc_personnel", label: "Qualified QC Personnel Undertaking (15%)" },
  { id: "raw_material_certs", label: "Raw Material Test Certificates (10%)" },
  { id: "test_log_register", label: "Routine Inspection & Test Register (10%)" },
  { id: "homologation_drawings", label: "Automotive CMVR Form 22 Drawings (10%)" },
  { id: "cop_plan", label: "Conformity of Production (COP) Plan AIS-037 (10%)" }
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaste! I am BIS Saathi, your regulatory compliance assistant. Speak or type to audit industrial goods (Cement, Steel, Toys) or automotive AIS standards (EV Batteries, Tracking Devices)."
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedDocs, setSelectedDocs] = useState(["factory_layout", "qc_personnel"]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriberReady, setTranscriberReady] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  const transcriberRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    async function loadWhisper() {
      try {
        transcriberRef.current = await pipeline(
          'automatic-speech-recognition',
          'whisper-tiny.en',
          { device: 'webgpu' }
        );
        setTranscriberReady(true);
      } catch {
        try {
          transcriberRef.current = await pipeline(
            'automatic-speech-recognition',
            'whisper-tiny.en',
            { device: 'wasm' }
          );
          setTranscriberReady(true);
        } catch (e) {
          console.error("Local Whisper failed, falling back to Web Speech API:", e);
        }
      }
    }
    loadWhisper();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakVerdict = (text) => {
    if (voiceMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#]/g, '');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      await processAudioTranscription(audioBlob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const processAudioTranscription = async (blob) => {
    if (!transcriberRef.current) return;
    setLoading(true);
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0);

      const output = await transcriberRef.current(audioData);
      const recognized = output.text.trim();
      if (recognized) {
        setInput(recognized);
        executeSaathiQuery(recognized);
      }
    } catch (err) {
      console.error("Whisper transcription error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDoc = (id) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const executeSaathiQuery = async (queryText) => {
    if (!queryText.trim()) return;
    setMessages(prev => [...prev, { sender: "user", text: queryText }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText, documents: selectedDocs })
      });
      const data = await res.json();

      let voiceLine = data.reply;
      if (data.audit_data) {
        const std = data.audit_data.audit_pack.governance.standard;
        const score = data.audit_data.audit_pack.gap_and_readiness.readiness_score;
        voiceLine = `Standard identified: ${std}. Computed readiness is ${score}.`;
      }

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: data.reply, auditData: data.audit_data || null, queryText }
      ]);
      speakVerdict(voiceLine);
    } catch {
      const errText = "Unable to connect to the compliance server.";
      setMessages(prev => [...prev, { sender: "bot", text: errText }]);
      speakVerdict(errText);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async (queryText) => {
    try {
      const res = await fetch(`${API_URL}/audit/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: queryText, documents: selectedDocs })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Audit_${queryText.replace(/ /g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Error exporting CSV report.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b1120", color: "#f8fafc", padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", flexDirection: "column", height: "94vh" }}>
        
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: 10, marginBottom: 10 }}>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#38bdf8", display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={18} color="#f59e0b" /> BIS Saathi — Regulatory Voice Agent
            </h1>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
              Offline Multi-Regime Governance (BIS ISI & CMVR AIS Homologation)
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setVoiceMuted(!voiceMuted);
                if (!voiceMuted && window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: voiceMuted ? "#334155" : "#0284c7", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
            >
              {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {voiceMuted ? "Muted" : "Voice Active"}
            </button>
            <span style={{ fontSize: "0.75rem", backgroundColor: transcriberReady ? "#065f46" : "#854d0e", color: transcriberReady ? "#6ee7b7" : "#fef08a", padding: "6px 10px", borderRadius: 6, fontWeight: 600 }}>
              {transcriberReady ? "Offline STT Ready" : "Loading STT..."}
            </span>
          </div>
        </div>

        {/* Checkbox Grid */}
        <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>
            Compliance Artifacts Present (Evaluated in Real-Time)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {AVAILABLE_DOCS.map(doc => {
              const active = selectedDocs.includes(doc.id);
              return (
                <div key={doc.id} onClick={() => toggleDoc(doc.id)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.78rem", color: active ? "#38bdf8" : "#64748b" }}>
                  {active ? <CheckSquare size={14} color="#38bdf8" /> : <Square size={14} />}
                  <span>{doc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation Stream */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4 }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start", alignSelf: m.sender === "user" ? "flex-end" : "flex-start", maxWidth: m.sender === "user" ? "80%" : "95%" }}>
              {m.sender === "bot" && (
                <div style={{ backgroundColor: "#0284c7", borderRadius: "50%", padding: 6, display: "flex" }}>
                  <Bot size={15} color="#fff" />
                </div>
              )}
              
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{
                  backgroundColor: m.sender === "user" ? "#0369a1" : "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "9px 13px",
                  fontSize: "0.85rem",
                  lineHeight: 1.45,
                  color: "#f8fafc"
                }}>
                  {m.text}
                </div>

                {m.auditData && (
                  <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "1px solid #1e293b", paddingBottom: 6 }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#38bdf8" }}>
                        Standard: {m.auditData.audit_pack.governance.standard}
                      </span>
                      <button
                        onClick={() => handleDownloadCsv(m.queryText)}
                        style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: "#0284c7", border: "none", color: "#fff", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}
                      >
                        <Download size={12} /> Export CSV
                      </button>
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "#cbd5e1", display: "flex", flexDirection: "column", gap: 3 }}>
                      <div><strong>Department:</strong> {m.auditData.classification.predicted_department}</div>
                      <div><strong>Order:</strong> {m.auditData.audit_pack.governance.qco_order}</div>
                      <div><strong>Certification Scheme:</strong> {m.auditData.audit_pack.governance.scheme}</div>
                      <div><strong>Testing Facility:</strong> {m.auditData.audit_pack.testing_and_labs.authorized_lab}</div>
                      <div><strong>Filing Route:</strong> {m.auditData.audit_pack.governance.filing_portal}</div>
                    </div>

                    <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Calculated Readiness:</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: m.auditData.audit_pack.gap_and_readiness.critical_gap_flag ? "#f87171" : "#4ade80" }}>
                        {m.auditData.audit_pack.gap_and_readiness.readiness_score} ({m.auditData.audit_pack.gap_and_readiness.status})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {m.sender === "user" && (
                <div style={{ backgroundColor: "#334155", borderRadius: "50%", padding: 6, display: "flex" }}>
                  <User size={15} color="#fff" />
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); const q = input; setInput(""); executeSaathiQuery(q); }} style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              backgroundColor: isRecording ? "#ef4444" : "#1e293b",
              border: "1px solid #334155",
              borderRadius: 8,
              padding: "0 14px",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} color="#38bdf8" />}
          </button>
          <input
            type="text"
            placeholder={isRecording ? "Listening (Click mic to stop)..." : "Ask BIS Saathi or click mic to speak..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "9px 12px", color: "#f8fafc", fontSize: "0.88rem", outline: "none" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#0284c7", border: "none", borderRadius: 8, padding: "0 16px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
          >
            <Send size={15} />
          </button>
        </form>

      </div>
    </div>
  );
}
