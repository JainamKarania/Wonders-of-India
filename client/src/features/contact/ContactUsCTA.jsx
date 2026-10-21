import { Link } from "react-router-dom";
import { Headset, MessageCircle, Mail, Phone } from "lucide-react";

const PHONE_HREF = "+919876543210";

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    title: "Call us",
    desc: "Speak directly with our travel advisors for quick help.",
  },
  {
    icon: Mail,
    title: "Email support",
    desc: "Share your travel ideas and get a detailed reply.",
  },
];

export default function ContactUsCTA() {
  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="section relative overflow-hidden bg-ink-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />

      <div className="container-page relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <header>
          <p className="eyebrow !text-brand-400">We're here to help</p>
          <h2
            id="contact-cta-heading"
            className="section-title mt-3 !text-white text-balance"
          >
            Let's plan your journey together
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Have a question, need a custom itinerary or want advice on where to
            go? Reach out and we'll help you plan.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${PHONE_HREF}`} className="btn-primary">
              <Headset size={18} aria-hidden="true" />
              Talk to an expert
            </a>
            <Link
              to="/chat"
              className="btn border border-white/30 text-white hover:bg-white/10"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat with our AI guide
            </Link>
          </div>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {CONTACT_OPTIONS.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow"
              >
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}