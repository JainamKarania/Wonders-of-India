import { useEffect, useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <section
        id="chat-panel"
        role="dialog"
        aria-label="Travel assistant"
        className={`fixed inset-x-3 bottom-24 z-50 flex h-[min(34rem,calc(100dvh-8rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-lift transition-all duration-300 sm:inset-x-auto sm:right-6 sm:w-[24rem] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible translate-y-4 scale-95 opacity-0"
        }`}
      >
        <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-white">
                Travel Assistant
              </p>
              <p className="flex items-center gap-1.5 text-xs text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Ask me anything about your trip
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/15 hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1">
          <ChatWindow autoFocus={open} />
        </div>
      </section>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow transition hover:bg-brand-700 active:scale-95 sm:right-6"
      >
        {open ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <MessageCircle size={24} aria-hidden="true" />
        )}
      </button>
    </>
  );
}