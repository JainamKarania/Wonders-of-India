import { useCallback, useState } from "react";
import axios from "axios";
import { supabase } from "../../lib/supabaseClient";

const MAX_HISTORY_MESSAGES = 10;
const REQUEST_TIMEOUT_MS = 30000;
const FALLBACK_ERROR = "Sorry, I couldn't process that. Please try again.";
const ACTION_ERROR = "That didn't go through. Nothing was changed, please try again.";
const DISMISS_REPLY = "No problem, I haven't changed anything.";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Namaste! I'm your Wonders of India travel assistant. Ask me about destinations and packages, or sign in and I can change or cancel your bookings.",
  isWelcome: true,
};

const toGeminiHistory = (messages) =>
  messages
    .filter((m) => !m.isWelcome && !m.isError && m.text)
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : undefined;
};

const runAction = async (action) => {
  const headers = await getAuthHeaders();
  const url = `${import.meta.env.VITE_API_URL}/api/bookings/${action.bookingId}`;
  const options = { timeout: REQUEST_TIMEOUT_MS, headers };

  const res =
    action.type === "cancel_booking"
      ? await axios.patch(url, { status: "cancelled" }, options)
      : await axios.put(url, action.params, options);

  if (!res.data?.success) throw new Error(res.data?.message || ACTION_ERROR);
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [sending, setSending] = useState(false);

  const setActionState = useCallback((actionId, patch) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.actions?.some((a) => a.id === actionId)
          ? {
              ...m,
              actions: m.actions.map((a) =>
                a.id === actionId ? { ...a, ...patch } : a
              ),
            }
          : m
      )
    );
  }, []);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText.trim();
      if (!text || sending) return;

      const history = toGeminiHistory(messages);

      setMessages((prev) => [...prev, { role: "user", text }]);
      setSending(true);

      try {
        const headers = await getAuthHeaders();

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/chat`,
          { message: text, history },
          { timeout: REQUEST_TIMEOUT_MS, headers }
        );

        if (!res.data.success) throw new Error(res.data.message);

        const actions = (res.data.actions ?? []).map((a) => ({
          ...a,
          status: "pending",
        }));

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: res.data.reply, actions },
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

  const confirmAction = useCallback(
    async (action) => {
      setActionState(action.id, { status: "confirming", error: null });

      try {
        await runAction(action);
        setActionState(action.id, { status: "done" });
        // Added as a normal assistant message so the model sees the outcome in
        // the history of the next turn.
        setMessages((prev) => [...prev, { role: "assistant", text: action.doneText }]);
      } catch (err) {
        console.error(err);
        setActionState(action.id, {
          status: "failed",
          error: err.response?.data?.message || ACTION_ERROR,
        });
      }
    },
    [setActionState]
  );

  const dismissAction = useCallback(
    (action) => {
      setActionState(action.id, { status: "dismissed" });
      setMessages((prev) => [...prev, { role: "assistant", text: DISMISS_REPLY }]);
    },
    [setActionState]
  );

  return { messages, sending, sendMessage, confirmAction, dismissAction };
}