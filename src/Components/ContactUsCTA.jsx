import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import { Call, Email, ChatBubbleOutline, SupportAgent } from "@mui/icons-material";

/**
 * Contact Us CTA – Wonders of India
 * Focus: Support, reassurance, easy connection
 * Tech: React, Tailwind CSS, Material UI, GSAP
 */

gsap.registerPlugin(ScrollTrigger);

export default function ContactUsCTA() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        opacity: 0,
        x: -60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(rightRef.current.children, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(actionsRef.current.children, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600"
    >
      {/* Soft glow background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Support Message */}
          <header ref={leftRef} className="space-y-6">
            <h2
              id="contact-cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Let’s Plan Your Journey Together
              <span className="block text-slate-900">We’re Here to Help</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Whether you have a question, need a custom itinerary, or want expert
              advice — our travel specialists at Wonders of India are just a call
              away.
            </p>

            <div
              ref={actionsRef}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* <Button
                variant="contained"
                size="large"
                startIcon={<SupportAgent />}
                className="!rounded-2xl !bg-slate-900 !px-7 !py-3 !text-base !font-semibold !normal-case hover:!bg-black"
              >
                Talk to an Expert
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ChatBubbleOutline />}
                className="!rounded-2xl !border-white !px-7 !py-3 !text-base !font-semibold !text-white !normal-case hover:!bg-white/10"
              >
                Start Live Chat
              </Button> */}
            </div>
          </header>

          {/* Contact Options */}
          <aside
            ref={rightRef}
            className="grid gap-6 sm:grid-cols-2"
          >
            {[{
              icon: <Call fontSize="large" className="text-indigo-600" />,
              title: "Call Us",
              desc: "Speak directly with our travel advisors for quick assistance.",
            },{
              icon: <Email fontSize="large" className="text-indigo-600" />,
              title: "Email Support",
              desc: "Share your travel ideas and receive detailed responses.",
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
          </aside>
        </div>
      </div>
    </section>
  );
}
