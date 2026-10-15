import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Map as MapIcon, MapPin, TrendingUp, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: MapIcon,
    title: "Curated regions",
    desc: "Handpicked destinations across North, South, East and West India.",
  },
  {
    icon: MapPin,
    title: "Hidden gems",
    desc: "Discover lesser-known places beyond the typical tourist routes.",
  },
  {
    icon: TrendingUp,
    title: "Seasonal picks",
    desc: "The best places to go, matched to weather and festivals.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function DestinationsCTA() {
  const [ref, inView] = useInView();

  const reveal = (delay = 0) => ({
    style: { transitionDelay: inView ? `${delay}ms` : "0ms" },
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });

  return (
    <section
      ref={ref}
      aria-labelledby="destinations-cta-heading"
      className="section relative overflow-hidden bg-ink-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />

      <div className="container-page relative">
        <header {...reveal()} className={`mx-auto max-w-2xl text-center ${reveal().className}`}>
          <p className="eyebrow !text-brand-400">Destinations</p>
          <h2
            id="destinations-cta-heading"
            className="section-title mt-3 !text-white"
          >
            Every destination tells a story
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-300 sm:text-lg">
            From royal palaces and sacred ghats to hidden hill towns and
            tropical coastlines, explore India through places curated by local
            experts.
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }, index) => {
            const { style, className } = reveal(index * 120);

            return (
              <li
                key={title}
                style={style}
                className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 ${className}`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow"
                >
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold !text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{desc}</p>
              </li>
            );
          })}
        </ul>

        <div
          {...reveal(360)}
          className={`mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row ${reveal(360).className}`}
        >
          <Link to="/destination" className="btn-primary">
            <MapIcon size={18} aria-hidden="true" />
            View all destinations
          </Link>
          <Link
            to="/chat"
            className="btn border border-white/30 text-white hover:bg-white/10"
          >
            <Sparkles size={18} aria-hidden="true" />
            Help me choose
          </Link>
        </div>
      </div>
    </section>
  );
}