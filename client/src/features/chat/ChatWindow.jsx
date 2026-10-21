import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { useChat } from "./useChat";

const SUGGESTIONS = [
  "Suggest a 5-day trip in Rajasthan",
  "Which packages are under ₹30,000?",
  "Show my upcoming bookings",
  "Best time to visit Kerala?",
];

const MAX_INPUT_HEIGHT = 120;

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function FormattedText({ text }) {
  const blocks = [];
  let list = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-1.5 list-disc space-y-1 pl-5">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    const bullet = trimmed.match(/^[-*•]\s+(.*)/);

    if (bullet) {
      list.push(bullet[1]);
      return;
    }

    flushList();
    if (!trimmed) return;

    blocks.push(
      <p key={`p-${blocks.length}`} className="[&:not(:first-child)]:mt-2">
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return <>{blocks}</>;
}

function Avatar({ isUser }) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        isUser ? "bg-ink-800 text-white" : "bg-brand-600 text-white"
      }`}
    >
      {isUser ? <User size={16} /> : <Sparkles size={16} />}
    </div>
  );
}

export default function ChatWindow({ autoFocus = false }) {
  const { messages, sending, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [input]);

  const submit = (text) => {
    const value = text.trim();
    if (!value || sending) return;
    sendMessage(value);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(input);
    }
  };

  const showSuggestions = messages.length <= 1 && !sending;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
      >
        {messages.map((m, i) => {
          const isUser = m.role === "user";

          return (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
            >
              <Avatar isUser={isUser} />
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "rounded-tr-md bg-ink-800 text-white"
                    : m.isError
                    ? "rounded-tl-md border border-red-100 bg-red-50 text-red-700"
                    : "rounded-tl-md bg-ink-50 text-ink-800"
                }`}
              >
                {isUser ? (
                  <span className="whitespace-pre-wrap break-words">{m.text}</span>
                ) : (
                  <FormattedText text={m.text ?? ""} />
                )}
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex items-center gap-2.5" role="status">
            <Avatar />
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-ink-50 px-4 py-3.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
              <span className="sr-only">Assistant is typing</span>
            </div>
          </div>
        )}

        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => submit(text)}
                className="rounded-full border border-brand-200 bg-brand-50 px-3.5 py-2 text-left text-xs font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-100 sm:text-sm"
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-ink-100 bg-white p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          placeholder="Ask about destinations, packages, bookings..."
          className="input max-h-[120px] min-h-[44px] flex-1 resize-none py-2.5 leading-6"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}