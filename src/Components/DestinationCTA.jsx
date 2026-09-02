import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Map, LocationOn, TrendingUp } from "@mui/icons-material";

const HIGHLIGHTS = [
  {
    icon: Map,
    title: "Curated Regions",
    desc: "Handpicked destinations across North, South, East & West India.",
  },
  {
    icon: LocationOn,
    title: "Hidden Gems",
    desc: "Discover lesser-known places beyond typical tourist routes.",
  },
  {
    icon: TrendingUp,
    title: "Seasonal Picks",
    desc: "Best destinations recommended based on weather & festivals.",
  },
];

function useInView(threshold = 0.2) {
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
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export default function DestinationsCTA() {
  const [headingRef, headingInView] = useInView(0.3);
  const [gridRef, gridInView] = useInView(0.2);
  const [actionRef, actionInView] = useInView(0.2);

  return (
    <section
      aria-labelledby="destinations-cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom,white,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="space-y-12 sm:space-y-14 text-center">
          {/* Heading */}
          <header
            ref={headingRef}
            className={`max-w-full transition-all duration-1000 ease-out ${
              headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-14"
            }`}
          >
            <h2
              id="destinations-cta-heading"
              className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Every Destination Tells a Story
              <span className="block text-slate-900">Which One Will You Discover?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg max-w-2xl mx-auto">
              From royal palaces and sacred ghats to hidden hill towns and tropical
              coastlines — explore India through destinations carefully curated by
              local experts.
            </p>
          </header>

          {/* Highlight Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3"
          >
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }, index) => (
              <article
                key={title}
                style={{ transitionDelay: gridInView ? `${index * 120}ms` : "0ms" }}
                className={`rounded-2xl bg-white/90 p-6 text-left shadow-xl backdrop-blur transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-2xl ${
                  gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <Icon className="text-emerald-700" fontSize="medium" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{desc}</p>
              </article>
            ))}
          </div>

          {/* CTA Actions */}
          <div
            ref={actionRef}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <div
              style={{ transitionDelay: actionInView ? "0ms" : "0ms" }}
              className={`transition-all duration-700 ease-out ${
                actionInView ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              <Button
                component={Link}
                to="/destination"
                variant="contained"
                size="large"
                startIcon={<Map />}
                className="!rounded-2xl !bg-slate-900 !px-6 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !normal-case hover:!bg-black"
              >
                View All Destinations
              </Button>
            </div>

            <div
              style={{ transitionDelay: actionInView ? "150ms" : "0ms" }}
              className={`transition-all duration-700 ease-out ${
                actionInView ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              <Button
                component={Link}
                to="/contact"
                variant="outlined"
                size="large"
                startIcon={<LocationOn />}
                className="!rounded-2xl !border-white !px-6 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !text-white !normal-case hover:!border-white hover:!bg-white/10"
              >
                Find My Destination
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}