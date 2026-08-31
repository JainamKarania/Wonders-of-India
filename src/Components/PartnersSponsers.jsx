import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@mui/material";
import { Business, Flight, Hotel, Public } from "@mui/icons-material";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  {
    name: "SkyRoute Airlines",
    icon: Flight,
    desc: "Official airline partner for domestic and international travel.",
  },
  {
    name: "Azure Heritage Hotels",
    icon: Hotel,
    desc: "Luxury and heritage stays across India.",
  },
  {
    name: "Bharat Tourism Alliance",
    icon: Public,
    desc: "Tourism partner promoting India's rich culture and heritage.",
  },
  {
    name: "Wanderlust Travel Partners",
    icon: Business,
    desc: "Trusted local operators ensuring seamless experiences.",
  },
];

export default function PartnersSponsors() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children, {
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

      gsap.from(gridRef.current?.children, {
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

  return (
    <section
      ref={sectionRef}
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-slate-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,white,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <header ref={headingRef} className="mx-auto max-w-3xl text-center space-y-4">
          <h2
            id="partners-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
          >
            Our Trusted Partners
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            We collaborate with leading travel brands and local experts to deliver
            safe, seamless, and unforgettable journeys across India.
          </p>
        </header>

        <div
          ref={gridRef}
          className="mt-12 sm:mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {partners.map(({ name, icon: Icon, desc }) => (
            <Card
              key={name}
              elevation={0}
              className="!rounded-2xl !border !border-slate-200 !bg-white !shadow-sm transition-all duration-300 hover:!shadow-lg hover:-translate-y-1"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                  <Icon fontSize="medium" className="text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}