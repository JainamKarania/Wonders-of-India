import { useCallback, useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const MAX_HISTORY_MESSAGES = 10;
const REQUEST_TIMEOUT_MS = 30000;
const FALLBACK_ERROR = "Sorry, I couldn't process that. Please try again.";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Namaste! I'm your Wonders of India travel assistant. Ask me about destinations, packages, or your own bookings.",
  isWelcome: true,
};

const toGeminiHistory = (messages) =>
  messages
    .filter((m) => !m.isWelcome && !m.isError)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [sending, setSending] = useState(false);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText.trim();
      if (!text || sending) return;

      // Snapshot the conversation as it stands before this message; the
      // backend appends the new message itself.
      const history = toGeminiHistory(messages);

      setMessages((prev) => [...prev, { role: "user", text }]);
      setSending(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/chat`,
          { message: text, history },
          {
            timeout: REQUEST_TIMEOUT_MS,
            headers: session?.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : undefined,
          }
        );

        if (!res.data.success) throw new Error(res.data.message);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: res.data.reply },
        ]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: err.response?.data?.message || FALLBACK_ERROR,
            isError: true,
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [messages, sending]
  );

  return { messages, sending, sendMessage };
}