import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, CalendarDays, Receipt, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

const TABS = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE = {
  confirmed: "badge-success",
  cancelled: "badge-danger",
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

export default function TransactionsDetails() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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
        if (!cancelled) setError("We couldn't load your transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate, reloadKey]);

  const sorted = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [bookings]
  );

  const filtered = useMemo(
    () => (activeTab === "all" ? sorted : sorted.filter((b) => b.status === activeTab)),
    [sorted, activeTab]
  );

  const summary = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    return {
      spent: confirmed.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0),
      confirmed: confirmed.length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  return (
    <section aria-label="Transactions" className="space-y-5">
      {!loading && !error && bookings.length > 0 ? (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="card p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Total spent
            </dt>
            <dd className="mt-1 font-display text-2xl font-extrabold text-ink-900">
              {formatPrice(summary.spent)}
            </dd>
            <p className="mt-0.5 text-xs text-ink-500">Confirmed bookings only</p>
          </div>
          <div className="card p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Confirmed
            </dt>
            <dd className="mt-1 font-display text-2xl font-extrabold text-ink-900">
              {summary.confirmed}
            </dd>
          </div>
          <div className="card p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Cancelled
            </dt>
            <dd className="mt-1 font-display text-2xl font-extrabold text-ink-900">
              {summary.cancelled}
            </dd>
          </div>
        </dl>
      ) : null}

      <div
        role="tablist"
        aria-label="Filter transactions"
        className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
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
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-ink-900 text-white"
                  : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-28 w-full !rounded-3xl" />
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
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"
          >
            <Receipt size={26} />
          </span>
          <p className="font-semibold text-ink-900">
            {bookings.length === 0 ? "No transactions yet" : "No transactions in this filter"}
          </p>
          {bookings.length === 0 ? (
            <Link to="/booking" className="btn-primary">
              Book a trip
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((txn) => {
            const cancelled = txn.status === "cancelled";

            return (
              <li key={txn.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-ink-500">
                      {formatBookingRef(txn.id)} · Booked {formatDate(txn.createdAt)}
                    </p>
                    <h3 className="mt-0.5 truncate font-display text-base font-bold text-ink-900">
                      {txn.destination?.title}
                    </h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`font-display text-lg font-extrabold ${
                        cancelled ? "text-ink-400 line-through" : "text-ink-900"
                      }`}
                    >
                      {formatPrice(txn.totalPrice)}
                    </p>
                    <span className={`${STATUS_BADGE[txn.status] ?? "badge"} mt-1 capitalize`}>
                      {txn.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 text-sm text-ink-700 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-6">
                    <span className="flex min-w-0 items-center gap-2">
                      {txn.fromCity ? (
                        <>
                          <span className="font-medium">{txn.fromCity}</span>
                          <ArrowRight size={14} aria-hidden="true" className="shrink-0 text-ink-400" />
                        </>
                      ) : null}
                      <span className="truncate">{formatLocations(txn.destination?.locations)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} aria-hidden="true" className="text-ink-500" />
                      {formatDate(txn.travelDate)}
                    </span>
                  </div>

                  {!cancelled ? (
                    <Link
                      to="/booking-history"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                    >
                      <Receipt size={16} aria-hidden="true" />
                      View invoice
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}