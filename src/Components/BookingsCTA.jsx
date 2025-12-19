import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mui/material";
import BookingModal from "./BookingModal";
// import Checklist from "@mui/icons-material/Checklist";
import ItineraryModal from "./ItineraryModal";
import {
  EventAvailable,
  Payments,
  Verified,
  Checklist,
} from "@mui/icons-material";

/**
 * Bookings Page CTA – Wonders of India
 * Focus: Confidence, clarity, conversion-ready booking
 * Tech: React, Tailwind CSS, Material UI, GSAP
 */

gsap.registerPlugin(ScrollTrigger);

export default function BookingsCTA() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stepsRef = useRef(null);
  const actionsRef = useRef(null);

  const [openBooking, setOpenBooking] = useState(false);
  const [openItinerary, setOpenItinerary] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(stepsRef.current.children, {
        opacity: 0,
        x: -40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
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
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="booking-cta-heading"
      className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-red-600 to-orange-500"
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <header ref={headerRef} className="space-y-6">
            <h2
              id="booking-cta-heading"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Book With Confidence
              <span className="block text-slate-900">
                Your Journey Starts Here
              </span>
            </h2>

            <p className="max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Simple steps, secure payments, and expert support at every stage.
              Choose your package, customize your plan, and get ready to explore
              India with peace of mind.
            </p>

            <div ref={actionsRef} className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="contained"
                size="large"
                startIcon={<EventAvailable />}
                onClick={() => setOpenBooking(true)}
                className="!rounded-2xl !bg-slate-900 !px-7 !py-3 !text-base !font-semibold !normal-case hover:!bg-black"
              >
                Proceed to Booking
              </Button>

              <BookingModal
                open={openBooking}
                onClose={() => setOpenBooking(false)}
              />

              <Button
                variant="outlined"
                size="large"
                startIcon={<Checklist />}
                onClick={() => setOpenItinerary(true)}
                className="!rounded-2xl !border-white !px-7 !py-3 !text-base !font-semibold !text-white !normal-case hover:!bg-white/10"
              >
                Review Itinerary
              </Button>

              <ItineraryModal
                open={openItinerary}
                onClose={() => setOpenItinerary(false)}
              />
            </div>
          </header>

          {/* Booking Assurance Steps */}
          <aside ref={stepsRef} className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: <Verified fontSize="large" className="text-rose-600" />,
                title: "Verified Packages",
                desc: "Transparent pricing with no hidden charges.",
              },
              {
                icon: <Payments fontSize="large" className="text-rose-600" />,
                title: "Secure Payments",
                desc: "Multiple payment options with full data protection.",
              },
              {
                icon: (
                  <EventAvailable fontSize="large" className="text-rose-600" />
                ),
                title: "Instant Confirmation",
                desc: "Get quick booking confirmation and travel details.",
              },
              {
                icon: <Checklist fontSize="large" className="text-rose-600" />,
                title: "Guided Process",
                desc: "Step-by-step assistance from booking to departure.",
              },
            ].map((item) => (
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
