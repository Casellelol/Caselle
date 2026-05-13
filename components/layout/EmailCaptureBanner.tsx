"use client"

import { useState } from "react"

export default function EmailCaptureBanner() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? "success" : "error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="w-full bg-[#1A1A18] text-[#FAFAF8] py-4 px-6 text-center">
        <p className="font-sans text-sm tracking-wide">
          You&apos;re in. Use code{" "}
          <span className="font-mono font-bold text-[#C9A96E] tracking-widest">WELCOME10</span>
          {" "}at checkout for 10% off.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#1A1A18] text-[#FAFAF8] py-5 px-6">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center">
        <p className="font-serif text-sm tracking-[0.05em] text-[#C9A96E] shrink-0">
          Get 10% off your first order
        </p>
        <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 sm:w-64 bg-transparent border border-[#8C8880] rounded px-3 py-2 text-sm text-[#FAFAF8] placeholder-[#8C8880] focus:outline-none focus:border-[#C9A96E] transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 bg-[#C9A96E] text-[#1A1A18] text-sm font-sans px-4 py-2 rounded hover:bg-[#B8945A] transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "…" : "Claim"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-xs text-red-400">Something went wrong — try again.</p>
        )}
      </div>
    </div>
  )
}
