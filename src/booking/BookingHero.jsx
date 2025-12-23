import React from "react";
import BookingForm from "./BookingForm";
import { LocationOn, Star, SupportAgent } from "@mui/icons-material";

const BookingHero = () => {
  return (
    <section
      aria-labelledby="booking-hero-heading"
      className="relative isolate overflow-hidden"
    >
      {/* 🌈 Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-green-200/30 blur-3xl" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* ================= LEFT CONTENT ================= */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-700">
              <LocationOn fontSize="small" />
              Explore Incredible India
            </div>

            <h1
              id="booking-hero-heading"
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Plan Your Next Journey with <br />
              <span className="text-orange-600">Wonders Of India</span>
            </h1>

            <p className="max-w-xl text-lg text-slate-600">
              From spiritual escapes to royal heritage and breathtaking
              landscapes, we curate unforgettable travel experiences across
              India — crafted just for you.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm">
                <Star className="text-yellow-500" />
                <div>
                  <p className="font-semibold text-slate-800">4.8 / 5</p>
                  <p className="text-sm text-slate-500">Traveler Ratings</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm">
                <LocationOn className="text-orange-500" />
                <div>
                  <p className="font-semibold text-slate-800">50+ Routes</p>
                  <p className="text-sm text-slate-500">Across India</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/70 p-4 shadow-sm">
                <SupportAgent className="text-green-600" />
                <div>
                  <p className="font-semibold text-slate-800">24/7</p>
                  <p className="text-sm text-slate-500">Travel Support</p>
                </div>
              </div>
            </div>

            {/* CTA Hint */}
            <p className="text-sm text-slate-500">
              ✨ Handcrafted itineraries • Trusted local guides • Best price
              guarantee
            </p>
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="flex justify-center lg:justify-end">
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(BookingHero);
