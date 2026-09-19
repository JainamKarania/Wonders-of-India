import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ChatWindow from "../chat/ChatWindow";

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Chat with Your Travel Assistant
          </h1>
          <p className="mt-2 text-slate-600">
            Ask about destinations, packages, or your own bookings.
          </p>
        </div>

        <div className="h-[70vh] rounded-3xl border border-orange-100 shadow-xl overflow-hidden">
          <ChatWindow />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;