import { Sparkles } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ChatWindow from "../chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      <main className="container-page max-w-3xl pb-14 pt-24 sm:pt-32">
        <header className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
            <Sparkles size={24} aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Your AI travel assistant
          </h1>
          <p className="section-subtitle mx-auto">
            Ask about destinations and packages, get trip ideas, or check on
            your own bookings.
          </p>
        </header>

        <div className="card h-[70vh] min-h-[28rem] overflow-hidden shadow-lift">
          <ChatWindow autoFocus />
        </div>
      </main>

      <Footer />
    </div>
  );
}