import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, MapPin, X } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function ChangeTripModal({ booking, open, onClose, onUpdated }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [fromCity, setFromCity] = useState("");
  const [destinationId, setDestinationId] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (!open || !booking) return undefined;

    setFromCity(booking.fromCity || "");
    setDestinationId(booking.destinationId ?? "");
    setError(null);

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinations`);
        if (!res.data.success) throw new Error(res.data.message);
        if (!cancelled) setDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn't load the destinations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open, booking, reloadKey]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const timer = setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open || !booking) return null;

  const selected = destinations.find((d) => String(d.id) === String(destinationId));
  const perPerson = selected ? selected.discountedPrice ?? selected.price ?? 0 : 0;
  const travelerCount = Math.max(booking.travelers?.length ?? 1, 1);
  const estimatedTotal = perPerson * travelerCount;

  const unchanged =
    fromCity.trim() === (booking.fromCity || "") &&
    Number(destinationId) === booking.destinationId;

  const handleSave = async (e) => {
    e.preventDefault();

    if (!fromCity.trim() || !destinationId) {
      toast.error("Enter a boarding station and pick a destination.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${booking.id}`,
        { fromCity: fromCity.trim(), destinationId: Number(destinationId) },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );

      if (!res.data.success) throw new Error(res.data.message);

      toast.success("Trip updated.");
      onUpdated(res.data.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update the trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-trip-title"
        className="relative w-full max-w-md animate-fade-up rounded-t-3xl bg-white p-6 shadow-lift sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <h2 id="change-trip-title" className="pr-10 font-display text-xl font-bold text-ink-900">
          Change trip
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Update your boarding station or package. Your travel date and travellers stay the same.
        </p>

        {loading ? (
          <div className="mt-6 space-y-4" aria-hidden="true">
            <div className="skeleton h-11 w-full" />
            <div className="skeleton h-11 w-full" />
          </div>
        ) : error ? (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label htmlFor="change-from" className="label">
                Boarding station
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  id="change-from"
                  ref={inputRef}
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="change-destination" className="label">
                Package
              </label>
              <select
                id="change-destination"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="input"
              >
                <option value="">Select a package</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            {selected ? (
              <div className="rounded-2xl bg-brand-50 p-4 text-sm text-ink-700">
                <p>
                  {formatPrice(perPerson)} × {travelerCount}{" "}
                  {travelerCount === 1 ? "traveller" : "travellers"}
                </p>
                <p className="mt-1 text-base font-bold text-ink-900">
                  New total: {formatPrice(estimatedTotal)}
                </p>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || unchanged || !fromCity.trim() || !destinationId}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}