import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import { FlightTakeoff, Explore } from "@mui/icons-material";

/**
 * CTA Component – Wonders of India
 * Tech: React, Tailwind CSS, Material UI, GSAP
 * Semantic, responsive & accessible
 */

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(buttonsRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text Content */}
          <header className="space-y-6">
            <h2
              ref={headingRef}
              id="cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Discover the Magic of India
              <span className="block text-gray-900">with Wonders of India</span>
            </h2>

            <p
              ref={textRef}
              className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg"
            >
              From the Himalayas to the backwaters of Kerala, explore curated travel
              experiences crafted for culture lovers, adventurers, and soul seekers.
              Your unforgettable journey begins here.
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to ="/destination"
                variant="contained"
                size="large"
                startIcon={<Explore />}
                className="!rounded-2xl !bg-gray-900 !px-6 !py-3 !text-base !font-semibold !normal-case hover:!bg-black"
              >
                Explore Packages
              </Link>

              {/* <Button
                variant="outlined"
                size="large"
                startIcon={<FlightTakeoff />}
                className="!rounded-2xl !border-white !px-6 !py-3 !text-base !font-semibold !text-white !normal-case hover:!bg-white/10"
              >
                Plan My Trip
              </Button> */}
            </div>
          </header>

          {/* Visual / Stats */}
          <aside className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {[
              { label: "Destinations", value: "50+" },
              { label: "Happy Travelers", value: "10k+" },
              { label: "Years of Trust", value: "8+" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/90 p-6 text-center shadow-lg backdrop-blur"
              >
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  {item.label}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
