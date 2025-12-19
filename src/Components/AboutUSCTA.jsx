import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import { Diversity3, Public, VolunteerActivism } from "@mui/icons-material";

/**
 * About Us CTA – Wonders of India
 * Focus: Trust, Storytelling, Brand Purpose
 * Tech: React, Tailwind CSS, Material UI, GSAP
 */

gsap.registerPlugin(ScrollTrigger);

export default function AboutUsCTA() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(cardsRef.current.children, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
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
      aria-labelledby="about-cta-heading"
      className="relative overflow-hidden bg-slate-900"
    >
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Story Content */}
          <div ref={contentRef} className="space-y-6">
            <h2
              id="about-cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              More Than Travel,
              <span className="block text-amber-400">We Create Meaningful Journeys</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Wonders of India was born from a deep love for culture, people, and
              places. We believe travel should inspire connection, preserve heritage,
              and leave a positive impact wherever you go.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="contained"
                size="large"
                startIcon={<Diversity3 />}
                className="!rounded-2xl !bg-amber-400 !px-6 !py-3 !text-base !font-semibold !text-slate-900 !normal-case hover:!bg-amber-500"
              >
                Meet Our Team
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Public />}
                className="!rounded-2xl !border-amber-400 !px-6 !py-3 !text-base !font-semibold !text-amber-400 !normal-case hover:!bg-amber-400/10"
              >
                Our Impact
              </Button>
            </div>
          </div>

          {/* Values Cards */}
          <div
            ref={cardsRef}
            className="grid gap-6 sm:grid-cols-2"
          >
            {[{
              icon: <Public fontSize="large" className="text-amber-400" />,
              title: "Authentic Experiences",
              desc: "Travel rooted in real stories, local culture, and genuine connections.",
            },{
              icon: <VolunteerActivism fontSize="large" className="text-amber-400" />,
              title: "Responsible Tourism",
              desc: "Supporting communities and protecting the places we explore.",
            },{
              icon: <Diversity3 fontSize="large" className="text-amber-400" />,
              title: "People First",
              desc: "Every journey is designed with care, trust, and transparency.",
            }].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-slate-800/80 p-6 shadow-xl backdrop-blur"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
