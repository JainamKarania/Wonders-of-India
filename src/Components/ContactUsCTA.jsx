import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import { Call, Email, ChatBubbleOutline, SupportAgent } from "@mui/icons-material";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_OPTIONS = [
  {
    icon: Call,
    title: "Call Us",
    desc: "Speak directly with our travel advisors for quick assistance.",
  },
  {
    icon: Email,
    title: "Email Support",
    desc: "Share your travel ideas and receive detailed responses.",
  },
];

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

      gsap.from(rightRef.current?.children, {
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

      gsap.from(actionsRef.current?.children, {
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <header ref={leftRef} className="space-y-5 sm:space-y-6">
            <h2
              id="contact-cta-heading"
              className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Let's Plan Your Journey Together
              <span className="block text-slate-900">We're Here to Help</span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Whether you have a question, need a custom itinerary, or want expert
              advice — our travel specialists at Wonders of India are just a call
              away.
            </p>

            <div
              ref={actionsRef}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <Button
                component="a"
                href="tel:+919876543210"
                variant="contained"
                size="large"
                startIcon={<SupportAgent />}
                className="!rounded-2xl !bg-slate-900 !px-5 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !normal-case hover:!bg-black"
              >
                Talk to an Expert
              </Button>

              <Button
                component={Link}
                to="/chat"
                variant="outlined"
                size="large"
                startIcon={<ChatBubbleOutline />}
                className="!rounded-2xl !border-white !px-5 sm:!px-7 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !text-white !normal-case hover:!border-white hover:!bg-white/10"
              >
                Start Live Chat
              </Button>
            </div>
          </header>

          <aside ref={rightRef} className="grid gap-6 sm:grid-cols-2">
            {CONTACT_OPTIONS.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                  <Icon className="text-orange-600" fontSize="medium" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {desc}
                </p>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}