import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { X, MapPin, CalendarDays, ArrowRight } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatLocations = (locations) =>
  Array.isArray(locations) ? locations.join(" → ") : locations;

export default function ItineraryModal({ open, onClose, destinationId }) {
  const [selectedId, setSelectedId] = useState(destinationId);
  const [allDestinations, setAllDestinations] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    setSelectedId(destinationId);
  }, [destinationId]);

  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const items = panelRef.current.querySelectorAll(FOCUSABLE);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;

    const loadList = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );
        if (!cancelled) setAllDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    loadList();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !selectedId) return undefined;

    let cancelled = false;

    const loadDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/itinerary?destinationId=${selectedId}`
        );
        if (!res.data.success) throw new Error(res.data.message);

        if (!cancelled) setDetail(res.data.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load this itinerary.");
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [open, selectedId]);

  if (!open) return null;

  const price = detail ? detail.discountedPrice ?? detail.price : null;
  const hasDiscount =
    detail?.discountedPrice && detail?.price && detail.discountedPrice < detail.price;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 animate-fade-in bg-ink-900/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Itinerary details"
        className="relative flex max-h-[92vh] w-full max-w-5xl animate-fade-up flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close itinerary"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink-800 shadow-soft transition hover:bg-white"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[2fr_3fr] md:overflow-hidden">
          <div className="relative flex flex-col gap-5 overflow-hidden bg-ink-900 p-6 text-white md:overflow-y-auto md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl"
            />

            {loading ? (
              <div className="relative space-y-4" aria-hidden="true">
                <div className="h-9 w-3/4 animate-pulse rounded-lg bg-white/10" />
                <div className="h-52 animate-pulse rounded-2xl bg-white/10" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
              </div>
            ) : detail ? (
              <>
                <div className="relative pr-12">
                  {detail.tag && (
                    <span className="badge mb-3 border border-brand-400/30 bg-brand-500/20 text-brand-200">
                      {detail.tag}
                    </span>
                  )}
                  <h2 className="text-2xl font-extrabold leading-tight !text-white md:text-3xl">
                    {detail.title}
                  </h2>
                  {detail.duration && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-ink-300">
                      <CalendarDays size={16} aria-hidden="true" className="text-brand-400" />
                      {detail.duration}
                    </p>
                  )}
                </div>

                {detail.image && (
                  <img
                    src={detail.image}
                    alt={detail.title}
                    className="relative h-48 w-full rounded-2xl border border-white/10 object-cover shadow-lift md:h-60"
                  />
                )}

                {detail.locations && (
                  <p className="relative flex items-start gap-2 text-sm leading-relaxed text-ink-200">
                    <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-400" />
                    {formatLocations(detail.locations)}
                  </p>
                )}

                {price ? (
                  <div className="relative flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-3xl font-extrabold text-white">
                      {formatPrice(price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-ink-400 line-through">
                        {formatPrice(detail.price)}
                      </span>
                    )}
                    <span className="text-xs text-ink-400">/ person</span>
                  </div>
                ) : null}

                <Link
                  to={`/booking?destinationId=${detail.id}`}
                  className="btn-primary relative mt-auto w-full"
                >
                  Book this package
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <p className="relative pr-12 text-sm text-ink-300">
                {error || "Select a destination to view its itinerary."}
              </p>
            )}
          </div>

          <div className="bg-ink-50 p-6 md:overflow-y-auto md:p-8">
            <label htmlFor="itinerary-switch" className="label">
              Choose another itinerary
            </label>
            <select
              id="itinerary-switch"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="input"
            >
              {allDestinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>

            <h3 className="mb-5 mt-8 text-xl font-bold text-ink-900">
              Day-wise itinerary
            </h3>

            {loading && (
              <div className="space-y-4" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="skeleton h-20" />
                ))}
              </div>
            )}

            {!loading && error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {!loading && detail && detail.days.length === 0 && (
              <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-6 text-center text-sm text-ink-500">
                Day-wise details for this package are coming soon.
              </div>
            )}

            {!loading && detail && detail.days.length > 0 && (
              <ol className="space-y-3">
                {detail.days.map((day) => (
                  <li
                    key={day.dayNumber}
                    className="card flex items-start gap-4 p-4"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white"
                    >
                      {day.dayNumber}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        <span className="sr-only">Day {day.dayNumber}: </span>
                        {day.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">
                        {day.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}