import { memo } from "react";
import { Compass, Headset, MapPin, Wallet } from "lucide-react";
import BookingForm from "./BookingForm";

const FEATURES = [
  {
    icon: Compass,
    title: "Handcrafted itineraries",
    desc: "Routes planned by people who know them.",
  },
  {
    icon: MapPin,
    title: "Trusted local guides",
    desc: "Experts on the ground at every stop.",
  },
  {
    icon: Wallet,
    title: "Clear pricing",
    desc: "Per-person rates with no hidden charges.",
  },
  {
    icon: Headset,
    title: "Travel support",
    desc: "Help before, during and after your trip.",
  },
];

function BookingHero() {
  return (
    <section
      id="booking-form"
      aria-labelledby="booking-hero-heading"
      className="relative isolate scroll-mt-20 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-ink-50"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
      />

      <div className="container-page py-10 sm:py-16 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Book your trip</p>
            <h1
              id="booking-hero-heading"
              className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink-900 text-balance sm:text-5xl"
            >
              Plan your next journey with{" "}
              <span className="text-brand-600">Wonders of India</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Choose a package, add your travellers and confirm in a couple of
              minutes. You can review everything in My Bookings afterwards.
            </p>

            <ul className="mt-8 hidden gap-4 sm:grid sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700"
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{title}</p>
                    <p className="mt-0.5 text-sm text-ink-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <BookingForm />
        </div>
      </div>
    </section>
  );
}

export default memo(BookingHero);