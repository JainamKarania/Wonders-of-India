import React from "react";
import Navbar from "../Components/Navbar";
import BookingHistory from "../Components/BookingHistory";

const BookingHistoryPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-orange-100 min-h-screen py-16">
      {/* Navbar */}
      <Navbar />

      {/* Hero / Page Header */}
      <div className="relative bg-orange-600 py-16 px-4 sm:px-6 lg:px-20 rounded-b-3xl shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center">
          Your Bookings
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-orange-100 text-center">
          Review all your trips with <strong>Wonders Of India</strong>
        </p>
      </div>

      {/* Booking History Content */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-20">
        <BookingHistory />
      </div>

      {/* Decorative Footer / Accent */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-orange-200 rounded-t-3xl -z-10"></div>
    </div>
  );
};

export default BookingHistoryPage;
