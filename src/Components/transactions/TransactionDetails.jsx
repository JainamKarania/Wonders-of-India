import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chip, CircularProgress } from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ReceiptLong,
  LocationOn,
  CalendarToday,
  Payments,
  TravelExplore,
} from "@mui/icons-material";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

const TABS = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function TransactionsDetails() {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

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
        setError("Failed to load your transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, navigate]);

  // Only fires once real data exists — running unconditionally on mount
  // would animate zero cards before the fetch resolves.
  useEffect(() => {
    if (loading || bookings.length === 0) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".booking-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [loading, bookings, activeTab]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === "all") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  return (
    <section className="p-6 md:p-8 bg-gray-50 rounded-3xl shadow-lg">
      <header className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-900">
          <TravelExplore className="text-gray-700" />
          Transaction History
        </h2>
        <p className="mt-1 text-gray-600 text-sm md:text-base max-w-2xl">
          A record of your bookings and their amounts with{" "}
          <span className="font-semibold text-gray-800">Wonders of India</span>.
        </p>
      </header>

      <nav className="mb-6 flex flex-wrap gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gray-800 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress sx={{ color: "#374151" }} />
        </div>
      )}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredTransactions.length === 0 && (
        <p className="text-gray-500">No transactions found for this filter.</p>
      )}

      {!loading && !error && filteredTransactions.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredTransactions.map((txn) => {
            const locations = Array.isArray(txn.destination?.locations)
              ? txn.destination.locations.join(", ")
              : txn.destination?.locations;
            const ref = `WOI-${String(txn.id).padStart(6, "0")}`;

            return (
              <article
                key={txn.id}
                className="booking-card relative flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition"
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-gray-700" />

                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between gap-2">
                  <p className="text-xs text-gray-400">Booking Reference</p>
                  <p className="font-semibold text-gray-800 truncate">{ref}</p>

                  <p className="text-xs text-gray-400 mt-1">Package</p>
                  <p className="font-medium text-gray-700 truncate">
                    {txn.destination?.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">Booked On</p>
                  <p className="font-medium text-gray-700 truncate">
                    {new Date(txn.createdAt).toDateString()}
                  </p>
                </div>

                <div className="flex-1 p-4 md:p-5 flex flex-col justify-center gap-2 border-l border-gray-200 md:border-l-0 md:border-r md:border-gray-200">
                  <p className="text-xs text-gray-400">Journey Details</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <LocationOn className="text-gray-700" fontSize="small" />
                    {txn.fromCity ? `${txn.fromCity} → ` : ""}
                    {locations}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">Journey Date</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <CalendarToday className="text-gray-700" fontSize="small" />
                    {new Date(txn.travelDate).toDateString()}
                  </p>
                </div>

                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between items-end text-right">
                  <div className="mb-2">
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-1 justify-end">
                      <Payments fontSize="small" className="text-gray-700" />
                      ₹{txn.totalPrice?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Chip
                      icon={
                        txn.status === "confirmed" ? <CheckCircle /> : <Cancel />
                      }
                      label={txn.status === "confirmed" ? "Confirmed" : "Cancelled"}
                      color={txn.status === "confirmed" ? "success" : "error"}
                      size="small"
                    />
                    <button
                      onClick={() => navigate("/booking-history")}
                      className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
                    >
                      <ReceiptLong fontSize="small" />
                      Invoice
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}