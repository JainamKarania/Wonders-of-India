import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import { Map, LocationOn, TrendingUp } from "@mui/icons-material";

/**
 * Destinations Page CTA – Wonders of India
 * Focus: Exploration, Discovery, Destination-driven inspiration
 * Tech: React, Tailwind CSS, Material UI, GSAP
 */

gsap.registerPlugin(ScrollTrigger);

export default function DestinationsCTA() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(gridRef.current.children, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(actionRef.current.children, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="destinations-cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600"
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,white,transparent_65%)] opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="space-y-14 text-center">
          {/* Heading */}
          <header className="max-w-full" ref={headingRef}>
            <h2
              id="destinations-cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Every Destination Tells a Story
              <span className="block text-slate-900">Which One Will You Discover?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              From royal palaces and sacred ghats to hidden hill towns and tropical
              coastlines — explore India through destinations carefully curated by
              local experts.
            </p>
          </header>

          {/* Highlight Grid */}
          <div
            ref={gridRef}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[{
              icon: <Map className="text-slate-900" fontSize="large" />,
              title: "Curated Regions",
              desc: "Handpicked destinations across North, South, East & West India.",
            },{
              icon: <LocationOn className="text-slate-900" fontSize="large" />,
              title: "Hidden Gems",
              desc: "Discover lesser-known places beyond typical tourist routes.",
            },{
              icon: <TrendingUp className="text-slate-900" fontSize="large" />,
              title: "Seasonal Picks",
              desc: "Best destinations recommended based on weather & festivals.",
            }].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>

          {/* CTA Actions */}
          <div
            ref={actionRef}
            className="flex flex-wrap items-center gap-4 justify-center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Map />}
              className="!rounded-2xl !bg-slate-900 !px-7 !py-3 !text-base !font-semibold !normal-case hover:!bg-black"
            >
              View All Destinations
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<LocationOn />}
              className="!rounded-2xl !border-white !px-7 !py-3 !text-base !font-semibold !text-white !normal-case hover:!bg-white/10"
            >
              Find My Destination
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
