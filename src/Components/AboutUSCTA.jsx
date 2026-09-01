import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import { Diversity3, Public, VolunteerActivism } from "@mui/icons-material";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    icon: Public,
    title: "Authentic Experiences",
    desc: "Travel rooted in real stories, local culture, and genuine connections.",
  },
  {
    icon: VolunteerActivism,
    title: "Responsible Tourism",
    desc: "Supporting communities and protecting the places we explore.",
  },
  {
    icon: Diversity3,
    title: "People First",
    desc: "Every journey is designed with care, trust, and transparency.",
  },
];

export default function AboutUsCTA() {
  // const sectionRef = useRef(null);
  // const contentRef = useRef(null);
  // const cardsRef = useRef(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     gsap.from(contentRef.current?.children, {
  //       opacity: 0,
  //       y: 50,
  //       duration: 1,
  //       stagger: 0.2,
  //       ease: "power3.out",
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 85%",
  //       },
  //     });

  //     gsap.from(cardsRef.current?.children, {
  //       opacity: 0,
  //       scale: 0.9,
  //       duration: 0.8,
  //       stagger: 0.15,
  //       ease: "back.out(1.7)",
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top 80%",
  //       },
  //     });
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  return (
    <section
      // ref={sectionRef}
      aria-labelledby="about-cta-heading"
      className="relative overflow-hidden bg-slate-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="space-y-5 sm:space-y-6">
            <h2
              id="about-cta-heading"
              className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              More Than Travel,
              <span className="block text-amber-400">We Create Meaningful Journeys</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Wonders of India was born from a deep love for culture, people, and
              places. We believe travel should inspire connection, preserve heritage,
              and leave a positive impact wherever you go.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
              <Button
                component={Link}
                to="/contact"
                variant="contained"
                size="large"
                startIcon={<Diversity3 />}
                className="!rounded-2xl !bg-amber-400 !px-5 sm:!px-6 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !text-slate-900 !normal-case hover:!bg-amber-500"
              >
                Meet Our Team
              </Button>

              <Button
                component="a"
                href="#our-impact"
                variant="outlined"
                size="large"
                startIcon={<Public />}
                className="!rounded-2xl !border-amber-400 !px-5 sm:!px-6 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !text-amber-400 !normal-case hover:!border-amber-400 hover:!bg-amber-400/10"
              >
                Our Impact
              </Button>
            </div>
          </div>

          <div
            id="our-impact"
            className="grid grid-cols-1 gap-5 sm:gap-6 scroll-mt-28"
          >
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="flex items-start gap-4 rounded-2xl bg-slate-800/80 p-6 shadow-xl backdrop-blur transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/20">
                  <Icon fontSize="medium" className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    {desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}