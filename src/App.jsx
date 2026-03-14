import { useState, useRef, useEffect } from "react";

const API_KEY = "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";

const SYSTEM_PROMPT = `You are an expert football betting analyst and advisor. Your role is to:
- Analyse team form, head-to-head records, injuries, and league standings
- Suggest value bets, accumulators, and single bets
- Assess risk levels for different bet types
- Explain your reasoning clearly
- Discuss Premier League, Championship, Scottish Premiership, European leagues, and international football
- Give balanced, informed opinions - never guarantee wins, always highlight risks
- Format your responses clearly with relevant stats and reasoning
- Use football terminology naturally
- When suggesting accas, assess the weakest link and overall risk
- Always remind users to gamble responsibly

Be conversational, knowledgeable, and engaging.`;

const suggestions = [
  "⚽ Analyse Arsenal's home form this season",
  "🎯 Suggest a weekend acca for the Championship",
  "📊 Compare Man City vs West Ham for betting",
  "🔥 What are some value bets this weekend?",
  "📈 Best bet types for accumulator betting",
  "🏆 Premier League top 4 odds analysis",
];

export default function BettingAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f0a",
      fontFamily: "'Georgia', serif",
      display: "flex",
      flexDirection: "column",
      color: "#e8e0d0",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #0d1a0d 0%, #0a120a 100%)",
        borderBottom: "1px solid #1a3a1a",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          width: 44, height: 44,
          background: "linear-gradient(135deg, #2d7a2d, #1a5c1a)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          boxShadow: "0 0 15px rgba(45,122,45,0.4)",
          flexShrink: 0,
        }}>⚽</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: "bold", letterSpacing: "0.5px", color: "#e8e0d0" }}>The Gaffer</div>
          <div style={{ fontSize: 11, color: "#4a9a4a", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Courier New', monospace" }}>AI Betting Analyst</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2d7a2d", boxShadow: "0 0 8px #2d7a2d", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#4a9a4a", fontFamily: "monospace", letterSpacing: 1 }}>LIVE</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f0a; }
        ::-webkit-scrollbar-thumb { background: #1a3a1a; border-radius: 2px; }
      `}</style>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px", maxWidth: 780, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {messages.length === 0 && (
          <div style={{ animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", padding: "40px 20px 32px" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🏟️</div>
              <h2 style={{ fontSize: 26, fontWeight: "bold", color: "#e8e0d0", margin: "0 0 8px" }}>Welcome to The Gaffer</h2>
              <p style={{ color: "#6a8a6a", fontSize: 14, maxWidth: 400, margin: "0 auto 8px", lineHeight: 1.6 }}>Your personal AI football betting analyst.</p>
              <p style={{ color: "#3a6a3a", fontSize: 11, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>⚠ Please gamble responsibly · 18+</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginTop: 8 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{
                  background: "rgba(20,40,20,0.6)", border: "1px solid #1a3a1a", borderRadius: 10,
                  padding: "12px 14px", color: "#a8c8a8", fontSize: 13, cursor: "pointer",
                  textAlign: "left", fontFamily: "inherit", lineHeight: 1.4,
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 16, animation: "fadeUp 0.3s ease" }}>
            {m.role === "assistant" && (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a2d, #1a5c1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 10, marginTop: 2 }}>⚽</div>
            )}
            <div style={{
              maxWidth: "75%",
              background: m.role === "user" ? "linear-gradient(135deg, #1a4a1a, #0f2f0f)" : "rgba(15,25,15,0.9)",
              border: m.role === "user" ? "1px solid #2d7a2d" : "1px solid #1a3a1a",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px", fontSize: 14, lineHeight: 1.7,
              color: m.role === "user" ? "#c8e8c8" : "#d8d0c0",
              whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #2d7a2d, #1a5c1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚽</div>
            <div style={{ background: "rgba(15,25,15,0.9)", border: "1px solid #1a3a1a", borderRadius: "18px 18px 18px 4px", padding: "12px 18px", display: "flex", gap: 6, alignItems: "center" }}>
              {[0,1,2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "#2d7a2d", animation: `blink 1.2s ${j * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: "linear-gradient(0deg, #0a0f0a 80%, transparent)", padding: "16px", position: "sticky", bottom: 0 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 10, background: "rgba(15,25,15,0.95)", border: "1px solid #1a3a1a", borderRadius: 14, padding: "8px 8px 8px 16px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about form, fixtures, value bets, accas..."
            rows={1}
            style={{ flex: 1, background: "transparent", border: "none", color: "#e8e0d0", fontSize: 14, fontFamily: "'Georgia', serif", resize: "none", lineHeight: 1.5, padding: "6px 0", maxHeight: 120, overflowY: "auto" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: input.trim() && !loading ? "linear-gradient(135deg, #2d7a2d, #1a5c1a)" : "rgba(30,50,30,0.5)",
              border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
            }}
          >➤</button>
        </div>
        <p style={{ textAlign: "center", fontSize: 10, color: "#2a4a2a", margin: "8px 0 0", fontFamily: "monospace" }}>FOR ENTERTAINMENT PURPOSES · GAMBLE RESPONSIBLY · 18+</p>
      </div>
    </div>
  );
}
