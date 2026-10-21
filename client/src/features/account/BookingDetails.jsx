import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  Luggage,
  Pencil,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import ChangeTripModal from "./ChangeTripModal";

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE = {
  confirmed: "badge-success",
  cancelled: "badge-danger",
};

const CONFIRM_COPY = {
  cancel: {
    message: "Cancel this trip? You can't undo this.",
    action: "Yes, cancel trip",
    keep: "Keep trip",
  },
  delete: {
    message: "Permanently delete this booking? It will be removed completely, not just cancelled.",
    action: "Yes, delete",
    keep: "Keep booking",
  },
};

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatBookingRef = (id) => `WOI-${String(id).padStart(6, "0")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const formatLocations = (locations) =>
  Array.isArray(locations) ? locations.join(", ") : locations ?? "";

const matchesTab = (booking, tab) => {
  if (tab === "upcoming") {
    return booking.status === "confirmed" && new Date(booking.travelDate) > new Date();
  }
  if (tab === "confirmed") return booking.status === "confirmed";
  if (tab === "cancelled") return booking.status === "cancelled";
  return true;
};

export default function BookingDetails() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pending, setPending] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [changingBooking, setChangingBooking] = useState(null);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!user) {
      navigate("/auth");
      return undefined;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });

        if (!res.data.success) throw new Error(res.data.message);
        if (!cancelled) setBookings(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn't load your bookings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate, reloadKey]);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [bookings]
  );

  const counts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map((tab) => [tab.key, bookings.filter((b) => matchesTab(b, tab.key)).length])
      ),
    [bookings]
  );

  const filteredBookings = useMemo(
    () => sortedBookings.filter((b) => matchesTab(b, activeTab)),
    [sortedBookings, activeTab]
  );

  const runAction = async (type, bookingId) => {
    setPending({ id: bookingId, type });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const config = { headers: { Authorization: `Bearer ${session?.access_token}` } };
      const url = `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`;

      const res =
        type === "cancel"
          ? await axios.patch(url, { status: "cancelled" }, config)
          : await axios.delete(url, config);

      if (!res.data.success) throw new Error(res.data.message);

      if (type === "cancel") {
        toast.success("Trip cancelled.");
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
        );
      } else {
        toast.success("Booking deleted.");
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      }
      setConfirming(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          (type === "cancel" ? "Failed to cancel this trip." : "Failed to delete this booking.")
      );
    } finally {
      setPending(null);
    }
  };

  const handleBookingUpdated = (updated) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)));
  };

  const isBusy = (id) => pending?.id === id;

  return (
    <section aria-label="Your bookings">
      <div
        role="tablist"
        aria-label="Filter bookings"
        className="scrollbar-hide -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-ink-900 text-white"
                  : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-100"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active ? "bg-white/20" : "bg-ink-100 text-ink-600"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-40 w-full !rounded-3xl" />
          ))}
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
          <p className="text-ink-700">{error}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} className="btn-outline">
            <RefreshCw size={16} aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"
          >
            <Luggage size={26} />
          </span>
          <p className="font-semibold text-ink-900">
            {bookings.length === 0 ? "No bookings yet" : "No bookings in this category"}
          </p>
          {bookings.length === 0 ? (
            <Link to="/booking" className="btn-primary">
              Book a trip
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredBookings.map((b) => {
            const confirmed = b.status === "confirmed";
            const confirmType = confirming?.id === b.id ? confirming.type : null;
            const copy = confirmType ? CONFIRM_COPY[confirmType] : null;
            const busyType = isBusy(b.id) ? pending.type : null;

            return (
              <li key={b.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink-500">{formatBookingRef(b.id)}</p>
                      <h3 className="mt-0.5 truncate font-display text-lg font-bold text-ink-900">
                        {b.destination?.title}
                      </h3>
                    </div>
                    <span className={`${STATUS_BADGE[b.status] ?? "badge"} shrink-0 capitalize`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-ink-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
                    <span className="flex min-w-0 items-center gap-2">
                      {b.fromCity ? (
                        <>
                          <span className="font-medium">{b.fromCity}</span>
                          <ArrowRight size={14} aria-hidden="true" className="shrink-0 text-ink-400" />
                        </>
                      ) : null}
                      <span className="truncate">{formatLocations(b.destination?.locations)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} aria-hidden="true" className="text-ink-500" />
                      {formatDate(b.travelDate)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                    <p className="text-sm text-ink-600">
                      Total{" "}
                      <span className="text-base font-bold text-ink-900">
                        {formatPrice(b.totalPrice)}
                      </span>
                    </p>

                    {!copy ? (
                      <div className="flex flex-wrap gap-2">
                        {confirmed ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setChangingBooking(b)}
                              disabled={isBusy(b.id)}
                              className="btn-outline !px-3.5 !py-2 text-sm"
                            >
                              <Pencil size={14} aria-hidden="true" />
                              Change trip
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirming({ id: b.id, type: "cancel" })}
                              disabled={isBusy(b.id)}
                              className="btn-outline !px-3.5 !py-2 text-sm !text-amber-700"
                            >
                              <XCircle size={14} aria-hidden="true" />
                              Cancel
                            </button>
                          </>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setConfirming({ id: b.id, type: "delete" })}
                          disabled={isBusy(b.id)}
                          className="btn-outline !px-3.5 !py-2 text-sm !text-red-600"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {copy ? (
                    <div
                      role="alertdialog"
                      aria-label="Confirm action"
                      className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <p className="text-sm text-red-800">{copy.message}</p>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirming(null)}
                          disabled={isBusy(b.id)}
                          className="btn-ghost !px-3.5 !py-2 text-sm"
                        >
                          {copy.keep}
                        </button>
                        <button
                          type="button"
                          onClick={() => runAction(confirmType, b.id)}
                          disabled={isBusy(b.id)}
                          className="btn-danger !px-3.5 !py-2 text-sm"
                        >
                          {busyType ? (
                            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                          ) : null}
                          {busyType ? "Working…" : copy.action}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ChangeTripModal
        open={changingBooking !== null}
        booking={changingBooking}
        onClose={() => setChangingBooking(null)}
        onUpdated={handleBookingUpdated}
      />
    </section>
  );
}