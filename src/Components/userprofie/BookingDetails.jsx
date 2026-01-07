import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useBooking from "../../hooks/useBooking.js";
import { MdCancel } from "react-icons/md";
import { FiMoreVertical, FiEye } from "react-icons/fi";
import { CalendarToday, Route, Person } from "@mui/icons-material";

const BookingDetails = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();
  const email = localStorage.getItem("woi_user_email");
  const { booking, updateBookingStatus } = useBooking(email); // ✅ support status update

  const bookings = Array.isArray(booking) ? booking : [];
  const now = Date.now();
  const TWELVE_DAYS = 12 * 24 * 60 * 60 * 1000;

  // Sort bookings by creation date descending
  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [bookings]);

  // Filter bookings by tab and age
  const filteredBookings = useMemo(() => {
    return sortedBookings.filter((b) => {
      const age = now - new Date(b.createdAt).getTime();
      if (age > TWELVE_DAYS) return false;

      if (activeTab === "all") return true;
      if (activeTab === "upcoming")
        return (
          b.status === "Confirmed" && new Date(b.booking.date) > new Date()
        );
      if (activeTab === "confirmed") return b.status === "Confirmed";
      if (activeTab === "cancelled") return b.status === "Canceled";

      return true;
    });
  }, [sortedBookings, activeTab]);

  const toggleMenu = (id) => setOpenMenuId((prev) => (prev === id ? null : id));

  const handleCancelTrip = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      updateBookingStatus(bookingId, "Canceled");
    }
  };

  const handleViewDetails = (b) => {
    navigate("/booking-history", {
      state: { bookingId: b.bookingId },
    });
  };

  return (
    <section
      className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-8"
      aria-labelledby="booking-heading"
    >
      {/* Header */}
      <header className="mb-6">
        <h2
          id="booking-heading"
          className="text-2xl md:text-3xl font-bold text-gray-800"
        >
          Your Bookings ✈️
        </h2>
        <p className="text-gray-500 mt-1">
          Track and manage your journeys across India
        </p>
      </header>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-3 mb-8">
        {[
          { key: "all", label: "All Bookings" },
          { key: "upcoming", label: "Upcoming Bookings" },
          { key: "confirmed", label: "Confirmed Trips" },
          { key: "cancelled", label: "Canceled Trips" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Booking Cards */}
      <div className="flex flex-col gap-4">
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500">No bookings found for this category.</p>
        ) : (
          filteredBookings.map((b) => (
            <article
              key={b.bookingId}
              className="relative flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition"
            >
              {/* Left accent bar */}
              <span className="absolute left-0 top-0 h-full w-1 bg-gray-700" />

              {/* Left Section: Booking & Email */}
              <div className="flex-1 p-5 flex flex-col justify-between gap-2">
                <p className="text-xs text-gray-400">Booking ID</p>
                <p className="font-semibold text-gray-800 truncate">
                  {b.bookingId}
                </p>

                <p className="text-xs text-gray-400 mt-1">Package</p>
                <p className="font-medium text-gray-700 truncate">
                  {b.booking.package}
                </p>

                <p className="text-xs text-gray-400 mt-1">Email</p>
                <p className="font-medium text-gray-700 truncate">
                  {b.booking.email}
                </p>
              </div>

              {/* Middle Section: Journey Info */}
              <div className="flex-1 p-5 flex flex-col justify-center gap-2 border-l border-gray-200 md:border-l-0 md:border-r md:border-gray-200">
                <p className="text-xs text-gray-400">Journey</p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <Route size={16} /> {b.booking.from} → {b.booking.to}
                </p>

                <p className="text-xs text-gray-400 mt-1">Date</p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <CalendarToday fontSize="small" />{" "}
                  {new Date(b.booking.date).toDateString()}
                </p>
              </div>

              {/* Right Section: Status & Actions */}
              <div className="flex-1 p-5 flex flex-col justify-between items-end text-right">
                {/* Booking Status */}
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    b.status.toLowerCase() === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.status}
                </span>

                {/* 3-Dots Menu */}
                <div className="relative mt-4">
                  <button
                    onClick={() => toggleMenu(b.bookingId)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    aria-label="More options"
                  >
                    <FiMoreVertical size={18} />
                  </button>

                  {openMenuId === b.bookingId && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border text-sm z-10">
                      <button
                        onClick={() => handleCancelTrip(b.bookingId)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <MdCancel className="text-red-600" /> Cancel Trip
                      </button>

                      <button
                        onClick={() => handleViewDetails(b)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiEye className="text-blue-600" /> View Full Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default BookingDetails;
