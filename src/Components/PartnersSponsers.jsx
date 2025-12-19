import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@mui/material";
import { Business, Flight, Hotel, Public } from "@mui/icons-material";

/**
 * Partners / Sponsors Component – Wonders of India
 * Focus: Trust, credibility, collaboration
 * Tech: React, Tailwind CSS, Material UI, GSAP
 */

gsap.registerPlugin(ScrollTrigger);

export default function PartnersSponsors() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current.children, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(gridRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.7,
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

  const partners = [
    {
      name: "Air India",
      icon: <Flight fontSize="large" className="text-amber-500" />,
      desc: "Official airline partner for domestic and international travel.",
    },
    {
      name: "Taj Hotels",
      icon: <Hotel fontSize="large" className="text-amber-500" />,
      desc: "Luxury and heritage stays across India.",
    },
    {
      name: "Incredible India",
      icon: <Public fontSize="large" className="text-amber-500" />,
      desc: "Tourism partner promoting India’s rich culture and heritage.",
    },
    {
      name: "Travel Associates",
      icon: <Business fontSize="large" className="text-amber-500" />,
      desc: "Trusted local operators ensuring seamless experiences.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-slate-100"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,white,transparent_70%)] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
        {/* Heading */}
        <header ref={headingRef} className="mx-auto max-w-3xl text-center space-y-4">
          <h2
            id="partners-heading"
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Our Trusted Partners
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            We collaborate with leading travel brands and local experts to deliver
            safe, seamless, and unforgettable journeys across India.
          </p>
        </header>

        {/* Partners Grid */}
        <div
          ref={gridRef}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {partners.map((partner) => (
            <Card
              key={partner.name}
              elevation={0}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="mb-4">{partner.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {partner.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {partner.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
