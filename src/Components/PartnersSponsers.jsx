import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, Skeleton } from "@mui/material";
import { Business, Flight, Hotel, Public } from "@mui/icons-material";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  flight: Flight,
  hotel: Hotel,
  public: Public,
  business: Business,
};

export default function PartnersSponsors() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/partners`
        );
        setPartners(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load partners.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

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

      if (!loading && !error && partners.length > 0) {
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, error, partners]);

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

        {loading && (
          <div className="mt-12 sm:mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={180}
                className="!rounded-2xl"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-12 text-center text-slate-500">{error}</p>
        )}

        {!loading && !error && partners.length > 0 && (
          <div
            ref={gridRef}
            className="mt-12 sm:mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {partners.map(({ name, icon, desc }) => {
              const Icon = ICON_MAP[icon] ?? Business;
              return (
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
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}