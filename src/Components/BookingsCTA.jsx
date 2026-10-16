import { Link } from "react-router-dom";
import { CalendarCheck, CreditCard, ListChecks, ShieldCheck } from "lucide-react";

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Verified packages",
    desc: "Transparent pricing with no hidden charges.",
  },
  {
    icon: CreditCard,
    title: "Secure booking",
    desc: "Your details are protected end to end.",
  },
  {
    icon: CalendarCheck,
    title: "Instant confirmation",
    desc: "Booking details appear in My Bookings right away.",
  },
  {
    icon: ListChecks,
    title: "Flexible changes",
    desc: "Change your boarding station or package before you travel.",
  },
];

export default function BookingsCTA() {
  return (
    <section
      aria-labelledby="booking-cta-heading"
      className="section relative overflow-hidden bg-ink-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />

      <div className="container-page relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <header>
          <p className="eyebrow !text-brand-400">Book with confidence</p>
          <h2
            id="booking-cta-heading"
            className="section-title mt-3 !text-white"
          >
            Your journey starts here
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
            Simple steps and clear prices. Pick your package, add your
            travellers and get ready to explore India.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#booking-form" className="btn-primary">
              <CalendarCheck size={18} aria-hidden="true" />
              Book a package
            </a>
            <Link
              to="/destination"
              className="btn border border-white/30 text-white hover:bg-white/10"
            >
              <ListChecks size={18} aria-hidden="true" />
              Browse packages
            </Link>
          </div>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ASSURANCES.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow"
              >
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}