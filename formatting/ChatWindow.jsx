import { useEffect, useRef, useState } from "react";
import { Send, SmartToy, Person } from "@mui/icons-material";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { useChat } from "../src/chat/useChat";

const ChatWindow = () => {
  const { messages, sending, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === "user" ? "bg-slate-800" : "bg-orange-500"
              }`}
            >
              {m.role === "user" ? (
                <Person fontSize="small" className="text-white" />
              ) : (
                <SmartToy fontSize="small" className="text-white" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-slate-800 text-white rounded-tr-sm"
                  : m.isError
                  ? "bg-red-50 text-red-700 rounded-tl-sm"
                  : "bg-orange-50 text-slate-800 rounded-tl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500">
              <SmartToy fontSize="small" className="text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-orange-50 px-4 py-2">
              <CircularProgress size={14} sx={{ color: "#fb923c" }} />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-slate-200 p-3"
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about destinations, packages, your bookings..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <IconButton
          type="submit"
          disabled={sending || !input.trim()}
          className="!bg-orange-500 hover:!bg-orange-600 disabled:!bg-slate-200"
        >
          <Send fontSize="small" className="text-white" />
        </IconButton>
      </form>
    </div>
  );
};

export default ChatWindow;