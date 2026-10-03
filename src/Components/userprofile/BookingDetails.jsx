import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { FiMoreVertical, FiEye } from "react-icons/fi";
import { CalendarToday, Route } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

const TABS = [
  { key: "all", label: "All Bookings" },
  { key: "upcoming", label: "Upcoming Bookings" },
  { key: "confirmed", label: "Confirmed Trips" },
  { key: "cancelled", label: "Canceled Trips" },
];

const BookingDetails = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );

      if (!res.data.success) throw new Error(res.data.message);
      setBookings(res.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return sortedBookings.filter((b) => {
      if (activeTab === "all") return true;
      if (activeTab === "upcoming")
        return b.status === "confirmed" && new Date(b.travelDate) > new Date();
      if (activeTab === "confirmed") return b.status === "confirmed";
      if (activeTab === "cancelled") return b.status === "cancelled";
      return true;
    });
  }, [sortedBookings, activeTab]);

  const toggleMenu = (id) => setOpenMenuId((prev) => (prev === id ? null : id));

  const handleCancelTrip = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    setCancellingId(bookingId);
    setOpenMenuId(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );

      if (!res.data.success) throw new Error(res.data.message);

      toast.success("Trip cancelled.");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel this trip.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewDetails = () => {
    navigate("/booking-history");
  };

  return (
    <section
      className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-8"
      aria-labelledby="booking-heading"
    >
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

      <nav className="flex flex-wrap gap-3 mb-8">
        {TABS.map((tab) => (
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

      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress sx={{ color: "#ea580c" }} />
        </div>
      )}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {filteredBookings.length === 0 ? (
            <p className="text-gray-500">No bookings found for this category.</p>
          ) : (
            filteredBookings.map((b) => {
              const locations = Array.isArray(b.destination?.locations)
                ? b.destination.locations.join(", ")
                : b.destination?.locations;

              return (
                <article
                  key={b.id}
                  className="relative flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition"
                >
                  <span className="absolute left-0 top-0 h-full w-1 bg-gray-700" />

                  <div className="flex-1 p-5 flex flex-col justify-between gap-2">
                    <p className="text-xs text-gray-400">Booking ID</p>
                    <p className="font-semibold text-gray-800 truncate">
                      WOI-{String(b.id).padStart(6, "0")}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">Package</p>
                    <p className="font-medium text-gray-700 truncate">
                      {b.destination?.title}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">Total</p>
                    <p className="font-medium text-gray-700 truncate">
                      ₹{b.totalPrice?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex-1 p-5 flex flex-col justify-center gap-2 border-l border-gray-200 md:border-l-0 md:border-r md:border-gray-200">
                    <p className="text-xs text-gray-400">Journey</p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <Route fontSize="small" />
                      {b.fromCity ? `${b.fromCity} → ` : ""}
                      {locations}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">Travel Date</p>
                    <p className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarToday fontSize="small" />{" "}
                      {new Date(b.travelDate).toDateString()}
                    </p>
                  </div>

                  <div className="flex-1 p-5 flex flex-col justify-between items-end text-right">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>

                    <div className="relative mt-4">
                      <button
                        onClick={() => toggleMenu(b.id)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        aria-label="More options"
                        disabled={cancellingId === b.id}
                      >
                        {cancellingId === b.id ? (
                          <CircularProgress size={18} sx={{ color: "#6b7280" }} />
                        ) : (
                          <FiMoreVertical size={18} />
                        )}
                      </button>

                      {openMenuId === b.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border text-sm z-10">
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => handleCancelTrip(b.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <MdCancel className="text-red-600" /> Cancel Trip
                            </button>
                          )}

                          <button
                            onClick={handleViewDetails}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <FiEye className="text-blue-600" /> View Full Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

export default BookingDetails;