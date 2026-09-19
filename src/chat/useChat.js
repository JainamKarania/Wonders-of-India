import { useCallback, useState } from "react";
import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Namaste! I'm your Wonders of India travel assistant. Ask me about destinations, packages, or your own bookings.",
};

const toGeminiHistory = (messages) =>
  messages.map((m) => ({
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

      // Snapshot the conversation as it stands *before* this message —
      // that's what the backend expects as `history`, since it appends
      // the new message separately.
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
          session?.access_token
            ? { headers: { Authorization: `Bearer ${session.access_token}` } }
            : undefined
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
            text: "Sorry, I couldn't process that. Please try again.",
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