"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "@/lib/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ─── shared return type ───────────────────────────────────────────────────────

interface ConversationHook {
  messages: ChatMessage[];
  isThinking: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
}

// ─── mock version ─────────────────────────────────────────────────────────────

const MOCK_REPLIES: Record<string, string> = {
  "Can I afford a ₹50L car?":
    "A ₹50L car EMI at 9% over 5 years = ₹10,400/mo. That cuts savings from ₹18,400 to ₹8,000 and pushes your house goal from Dec 2026 to mid-2028 — a 19-month delay. Worth waiting until after the down payment.",
  "How do I grow my emergency fund faster?":
    "You need ₹2.56L more. At your current rate that's 7 months. Redirect the dining overspend (₹4,200/mo above ₹5K) and you're there in 5. Add subscription cuts (~₹1,200/mo) and you hit it under 4.",
  "What if I get a 20% raise?":
    "₹18,400 extra per month. If you bank it all, savings jump to ₹36,800/mo and your house goal moves to Aug 2026 — 4 months earlier. Want me to model how to split it between goals?",
  "Am I on track for my goal?":
    "Yes — 38% to ₹20L with 14 months left. At ₹18,400/mo you need ₹12.4L more and you hit it 2 months before the deadline. Only risk: if dining keeps rising at 18%/quarter, that buffer disappears.",
};

const FALLBACK =
  "Based on your profile — ₹92K income, 20% savings rate, 14 months to goal — you are in a solid position. Your most urgent fix is the emergency fund gap. Want a week-by-week action plan?";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hey! I am Clara, your financial mentor. I have looked at your numbers — ₹92K income, 20% savings rate, 14 months to your house goal. You are doing well. What do you want to explore?",
  timestamp: new Date().toISOString(),
};

function useMockConversation(): ConversationHook {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content, timestamp: new Date().toISOString() }]);
    setIsThinking(true);
    await new Promise((r) => setTimeout(r, 650));
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: MOCK_REPLIES[content] ?? FALLBACK, timestamp: new Date().toISOString() },
    ]);
    setIsThinking(false);
  }, []);

  const clearConversation = useCallback(() => setMessages([INITIAL_MESSAGE]), []);

  return { messages, isThinking, sendMessage, clearConversation };
}

// ─── supabase + gemini version ────────────────────────────────────────────────

function useSupabaseConversation(): ConversationHook {
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const initConversation = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const res  = await fetch("/api/conversation/init", { method: "POST" });
      const data = await res.json();
      if (data?.messages) setMessages(data.messages);
    } catch {
      // silently fail during prerender
    }
  }, []);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  const sendMessage = useCallback(async (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content, timestamp: new Date().toISOString() }]);
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages.slice(-10) }),
      });

      if (!res.ok) throw new Error("Chat API error");

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "", timestamp: new Date().toISOString() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const text = line.slice(6);
            if (text === "[DONE]") break;
            assistantContent += text;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", content: assistantContent, timestamp: new Date().toISOString() },
            ]);
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong — please try again.", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsThinking(false);
    }
  }, [messages]);

  const clearConversation = useCallback(async () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      await fetch("/api/conversation/clear", { method: "POST" });
    }
    initConversation();
  }, [initConversation]);

  return { messages, isThinking, sendMessage, clearConversation };
}

// ─── public API ───────────────────────────────────────────────────────────────

export function useConversation(): ConversationHook {
  // Both hooks always called — no conditional hook calls
  const mock = useMockConversation();
  const real = useSupabaseConversation();
  return USE_MOCK ? mock : real;
}
