import { useState } from "react";
import { Chat as ChatIcon, Close } from "@mui/icons-material";
import ChatWindow from "../chat/ChatWindow";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm h-[32rem] max-h-[70vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between bg-orange-600 px-4 py-3">
            <p className="text-white font-semibold">Wonders of India Assistant</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/90 hover:text-white"
            >
              <Close fontSize="small" />
            </button>
          </div>
          <div className="h-[calc(100%-52px)]">
            <ChatWindow />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl hover:bg-orange-700 transition"
      >
        {open ? <Close /> : <ChatIcon />}
      </button>
    </>
  );
};

export default ChatWidget;