import { Link } from "react-router-dom";
import { Globe, HeartHandshake, MessageCircle, Users } from "lucide-react";

const VALUES = [
  {
    icon: Globe,
    title: "Authentic experiences",
    desc: "Travel rooted in real stories, local culture and genuine connections.",
  },
  {
    icon: HeartHandshake,
    title: "Responsible tourism",
    desc: "Supporting communities and protecting the places we explore.",
  },
  {
    icon: Users,
    title: "People first",
    desc: "Every journey is designed with care, trust and transparency.",
  },
];

export default function AboutUsCTA() {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="section relative overflow-hidden bg-ink-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />

      <div className="container-page relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow !text-brand-400">What we believe</p>
          <h2
            id="about-cta-heading"
            className="section-title mt-3 !text-white text-balance"
          >
            More than travel. We create meaningful journeys.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Wonders of India was born from a love for culture, people and
            places. We believe travel should inspire connection, preserve
            heritage and leave a positive impact wherever you go.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              <MessageCircle size={18} aria-hidden="true" />
              Contact us
            </Link>
            <a
              href="#our-values"
              className="btn border border-white/30 text-white hover:bg-white/10"
            >
              <Globe size={18} aria-hidden="true" />
              Our values
            </a>
          </div>
        </div>

        <ul id="our-values" className="scroll-mt-28 space-y-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow"
              >
                <Icon size={22} />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}