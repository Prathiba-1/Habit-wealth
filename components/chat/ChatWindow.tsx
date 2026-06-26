"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useConversation } from "@/hooks/useConversation";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Can I afford a ₹50L car?",
  "How do I grow my emergency fund faster?",
  "What if I get a 20% raise?",
  "Am I on track for my goal?",
];

function AiAvatar() {
  return (
    <div
      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium"
      style={{
        background: "var(--teal-ghost)",
        border: "1px solid var(--teal-dim)",
        color: "var(--teal)",
      }}
    >
      hw
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium"
      style={{ background: "var(--teal)", color: "#000" }}
    >
      AS
    </div>
  );
}

function AiBubble({ content }: { content: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <AiAvatar />
      <div
        className="text-[13px] leading-relaxed max-w-[84%] px-3 py-2.5"
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "4px 10px 10px 10px",
          color: "var(--text0)",
        }}
      >
        {content}
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex items-start justify-end gap-2.5">
      <div
        className="text-[13px] font-medium leading-relaxed max-w-[84%] px-3 py-2.5"
        style={{
          background: "var(--teal)",
          color: "#000",
          borderRadius: "10px 4px 10px 10px",
        }}
      >
        {content}
      </div>
      <UserAvatar />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <AiAvatar />
      <div
        className="px-3 py-2.5 flex items-center gap-1"
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "4px 10px 10px 10px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--text2)",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { messages, isThinking, sendMessage } = useConversation();
  const [input, setInput] = useState("");
  const [usedSuggestions, setUsedSuggestions] = useState<Set<string>>(
    new Set()
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isThinking) return;
    setInput("");
    await sendMessage(msg);
  };

  const handleSuggestion = (s: string) => {
    setUsedSuggestions((prev) => new Set([...prev, s]));
    handleSend(s);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const visibleSuggestions = SUGGESTIONS.filter((s) => !usedSuggestions.has(s));

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{ border: "1px solid var(--border)", background: "var(--bg1)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-medium shrink-0"
          style={{
            background: "var(--teal-ghost)",
            border: "1px solid var(--teal-dim)",
            color: "var(--teal)",
          }}
        >
          hw
        </div>
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--text0)" }}>
            Clara
          </p>
          <p className="text-[11px]" style={{ color: "var(--text2)" }}>
            Your AI financial mentor
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--green)" }}
          />
          <span className="text-[11px]" style={{ color: "var(--text2)" }}>
            Online
          </span>
        </div>
      </div>

      {/* Suggestion chips */}
      {visibleSuggestions.length > 0 && (
        <div
          className="flex flex-wrap gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {visibleSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              disabled={isThinking}
              className="text-[11px] px-2.5 py-1 rounded-full transition-colors disabled:opacity-40"
              style={{
                background: "var(--teal-ghost)",
                border: "1px solid rgba(0,212,180,.2)",
                color: "var(--teal)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Message thread */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((msg: ChatMessage, i) =>
          msg.role === "assistant" ? (
            <AiBubble key={i} content={msg.content} />
          ) : (
            <UserBubble key={i} content={msg.content} />
          )
        )}
        {isThinking && <TypingIndicator />}
      </div>

      {/* Input bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your finances…"
          disabled={isThinking}
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--text2)] disabled:opacity-50"
          style={{
            color: "var(--text0)",
            fontFamily: "var(--font-sans)",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isThinking}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity disabled:opacity-30"
          style={{ background: "var(--teal)" }}
          aria-label="Send message"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 1L11 6.5L6.5 12M11 6.5H2"
              stroke="#000"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
