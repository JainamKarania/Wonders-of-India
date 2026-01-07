import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSuitcaseRolling, FaRoute } from "react-icons/fa";

const UserProfileCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-10">
        <div className="container max-w-7xl mx-auto px-4">
    <aside
      aria-labelledby="profile-cta-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white shadow-2xl"
    >
      {/* Decorative blur */}
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 p-6 sm:p-8 items-center justify-center lg:p-10 flex flex-col gap-6">
        {/* Heading */}
        <header className="space-y-2">
          <h2
            id="profile-cta-heading"
            className="text-2xl sm:text-5xl font-bold leading-tight"
          >
            Ready for your next adventure?
          </h2>
          <p className="text-white/90 max-w-2xl text-center text-sm sm:text-md">
            Discover breathtaking destinations across India and create memories
            that last a lifetime.
          </p>
        </header>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-orange-600 font-semibold shadow-lg hover:bg-orange-50 transition"
          >
            <FaSuitcaseRolling size={18} />
            Book a New Trip
          </button>

          <button
            onClick={() => navigate("/booking-history")}
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
          >
            <FaRoute size={18} />
            View My Bookings
          </button>
        </div>
      </div>
      <footer className="p-4 border-t text-center border-white/30 text-sm text-white/80">
          ✈️ Trusted by thousands of travelers exploring{" "}
          <span className="font-semibold text-white">
            Wonders of India
          </span>
        </footer>
    </aside>
    </div>
    </section>
  );
};

export default UserProfileCTA;
