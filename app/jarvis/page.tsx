"use client"

import { useState, useRef, useEffect } from "react"

type Message = { role: "user" | "jarvis"; text: string }

export default function JarvisPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "jarvis", text: "Online. How can I serve you, sir?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg = text.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch("/api/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      const reply = data.response || data.error || "No response."
      setMessages(prev => [...prev, { role: "jarvis", text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: "jarvis", text: "Connection error. Try again." }])
    } finally {
      setLoading(false)
    }
  }

  function startListening() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice not supported in this browser. Use Chrome or Safari.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      send(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", maxWidth: 600, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a3a", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }} />
        <span style={{ fontWeight: 700, letterSpacing: "0.15em", fontSize: 14, color: "#89c4e1" }}>J.A.R.V.I.S.</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#3b5070" }}>CASELLE COMMAND</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "82%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "#1a2a4a" : "#0d1929",
              border: msg.role === "jarvis" ? "1px solid #1a2a4a" : "none",
              color: msg.role === "user" ? "#bae6fd" : "#e0e8ff",
              fontSize: 15,
              lineHeight: 1.55,
            }}>
              {msg.role === "jarvis" && (
                <div style={{ fontSize: 10, color: "#3b82f6", letterSpacing: "0.1em", marginBottom: 6 }}>JARVIS</div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#0d1929", border: "1px solid #1a2a4a" }}>
              <div style={{ fontSize: 10, color: "#3b82f6", letterSpacing: "0.1em", marginBottom: 6 }}>JARVIS</div>
              <span style={{ color: "#3b82f6", letterSpacing: "0.2em" }}>···</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a3a", display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Ask JARVIS anything..."
          style={{
            flex: 1,
            background: "#0d1929",
            border: "1px solid #1a2a4a",
            borderRadius: 12,
            padding: "12px 16px",
            color: "#e0e8ff",
            fontSize: 15,
            outline: "none",
          }}
        />
        {/* Voice button */}
        <button
          onClick={startListening}
          style={{
            width: 46, height: 46, borderRadius: "50%",
            background: listening ? "#1d4ed8" : "#0d1929",
            border: `1px solid ${listening ? "#3b82f6" : "#1a2a4a"}`,
            color: "#89c4e1",
            fontSize: 20,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: listening ? "0 0 12px #3b82f6" : "none",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          🎙
        </button>
        {/* Send button */}
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          style={{
            width: 46, height: 46, borderRadius: "50%",
            background: input.trim() ? "#1d4ed8" : "#0d1929",
            border: "1px solid #1a2a4a",
            color: "#fff",
            fontSize: 18,
            cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: loading ? 0.5 : 1,
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>

    </div>
  )
}
