import { Link } from "react-router-dom";
import { Compass, Luggage } from "lucide-react";

export default function UserProfileCTA() {
  return (
    <section
      aria-labelledby="profile-cta-heading"
      className="relative overflow-hidden rounded-3xl bg-ink-900 p-6 text-white sm:p-8 lg:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2
            id="profile-cta-heading"
            className="font-display text-2xl font-extrabold text-balance sm:text-3xl"
          >
            Ready for your next adventure?
          </h2>
          <p className="mt-2 text-sm text-ink-300 sm:text-base">
            Explore destinations across India and plan your next trip.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <Link to="/booking" className="btn-primary">
            <Luggage size={18} aria-hidden="true" />
            Book a new trip
          </Link>
          <Link
            to="/destination"
            className="btn border border-white/30 text-white hover:bg-white/10"
          >
            <Compass size={18} aria-hidden="true" />
            Browse destinations
          </Link>
        </div>
      </div>
    </section>
  );
}