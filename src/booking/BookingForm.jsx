import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useAuth } from "../Components/context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import RecommendedDestinations from "../recommendations/RecommendedDestinations";

const GENDERS = ["Male", "Female", "Other"];
const EMPTY_TRAVELER = { name: "", age: "", gender: "", mobile: "" };
const STEPS = ["Trip details", "Travellers"];

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const toDateInputValue = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateInput = (value) => {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};

const formatLocations = (locations) =>
  Array.isArray(locations) ? locations.join(", ") : locations ?? "";

function validateTraveler(t) {
  const errors = {};
  if (!t.name.trim()) errors.name = "Enter the traveller's name";
  const age = Number(t.age);
  if (!t.age) errors.age = "Enter age";
  else if (!Number.isInteger(age) || age < 1 || age > 120) errors.age = "Enter a valid age";
  if (!t.gender) errors.gender = "Select gender";
  if (!/^\d{10}$/.test(t.mobile.replace(/\s|-/g, ""))) {
    errors.mobile = "Enter a 10-digit mobile number";
  }
  return errors;
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Stepper({ step }) {
  return (
    <ol className="mb-6 flex items-center gap-3" aria-label="Booking progress">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const done = step > number;
        const active = step === number;

        return (
          <li key={label} className="flex flex-1 items-center gap-3 last:flex-none">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                done || active
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 text-ink-500"
              }`}
            >
              {done ? <Check size={16} aria-hidden="true" /> : number}
            </span>
            <span
              className={`text-sm font-semibold ${
                active ? "text-ink-900" : "text-ink-500"
              }`}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 rounded ${
                  done ? "bg-brand-600" : "bg-ink-100"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export default function BookingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({ from: "", destinationId: "", date: "" });
  const [travelerDraft, setTravelerDraft] = useState(EMPTY_TRAVELER);
  const [travelerErrors, setTravelerErrors] = useState({});
  const [travelers, setTravelers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [destinations, setDestinations] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [destinationsError, setDestinationsError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const appliedUrlId = useRef(null);
  const today = useMemo(() => toDateInputValue(new Date()), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setDestinationsLoading(true);
        setDestinationsError(null);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinations`);
        if (!cancelled) setDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setDestinationsError("We couldn't load the packages.");
      } finally {
        if (!cancelled) setDestinationsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const idFromUrl = searchParams.get("destinationId");

  useEffect(() => {
    if (destinationsLoading || !idFromUrl || appliedUrlId.current === idFromUrl) return;

    const exists = destinations.some((d) => String(d.id) === idFromUrl);
    if (!exists) return;

    appliedUrlId.current = idFromUrl;
    setBooking((prev) => ({ ...prev, destinationId: idFromUrl }));
    setStep(1);
  }, [destinationsLoading, destinations, idFromUrl]);

  const selectedDestination = useMemo(
    () => destinations.find((d) => String(d.id) === String(booking.destinationId)),
    [destinations, booking.destinationId]
  );

  const perPersonPrice = selectedDestination
    ? selectedDestination.discountedPrice ?? selectedDestination.price ?? 0
    : 0;

  const estimatedTotal = travelers.length * perPersonPrice;

  const isStepOneValid =
    booking.from.trim() && booking.destinationId && booking.date && booking.date >= today;

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravelerChange = (e) => {
    const { name, value } = e.target;
    setTravelerDraft((prev) => ({ ...prev, [name]: value }));
    setTravelerErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const resetDraft = () => {
    setTravelerDraft(EMPTY_TRAVELER);
    setTravelerErrors({});
    setEditIndex(null);
  };

  const addOrUpdateTraveler = () => {
    const errors = validateTraveler(travelerDraft);
    if (Object.keys(errors).length > 0) {
      setTravelerErrors(errors);
      return;
    }

    const cleaned = {
      ...travelerDraft,
      name: travelerDraft.name.trim(),
      mobile: travelerDraft.mobile.replace(/\s|-/g, ""),
    };

    if (editIndex !== null) {
      setTravelers((prev) => prev.map((t, i) => (i === editIndex ? cleaned : t)));
    } else {
      setTravelers((prev) => [...prev, cleaned]);
    }

    resetDraft();
  };

  const editTraveler = (index) => {
    setTravelerDraft(travelers[index]);
    setTravelerErrors({});
    setEditIndex(index);
  };

  const removeTraveler = (index) => {
    setTravelers((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) resetDraft();
    else if (editIndex !== null && index < editIndex) setEditIndex(editIndex - 1);
  };

  const submitBooking = async () => {
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      navigate("/auth");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          destinationId: booking.destinationId,
          fromCity: booking.from.trim(),
          travelDate: parseDateInput(booking.date).toISOString(),
          travelers,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Booking failed");
      }

      toast.success("Booking confirmed!");
      navigate("/booking-history", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasUnsavedDraft = Object.values(travelerDraft).some(Boolean);

  return (
    <div className="card w-full p-5 sm:p-8">
      <Stepper step={step} />

      {step === 1 ? (
        <section className="space-y-5" aria-labelledby="trip-heading">
          <div>
            <h2 id="trip-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
              Start your journey
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Tell us where you're leaving from and which package you want.
            </p>
          </div>

          {!user ? (
            <p className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800">
              You'll need to{" "}
              <Link to="/auth" className="font-semibold underline">
                sign in
              </Link>{" "}
              to confirm a booking. You can fill in the details first.
            </p>
          ) : null}

          <Field label="Boarding station / city" htmlFor="from">
            <div className="relative">
              <MapPin
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                id="from"
                name="from"
                value={booking.from}
                onChange={handleBookingChange}
                autoComplete="address-level2"
                placeholder="e.g. Mumbai"
                className="input pl-10"
              />
            </div>
          </Field>

          <Field label="Package" htmlFor="destinationId">
            {destinationsLoading ? (
              <div className="skeleton h-11 w-full" aria-label="Loading packages" />
            ) : destinationsError ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <span>{destinationsError}</span>
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="font-semibold underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                id="destinationId"
                name="destinationId"
                value={booking.destinationId}
                onChange={handleBookingChange}
                className="input"
              >
                <option value="">Select a package</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.title} — {formatPrice(dest.discountedPrice ?? dest.price)} / person
                  </option>
                ))}
              </select>
            )}
          </Field>

          {selectedDestination ? (
            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">{selectedDestination.title}</p>
                  {selectedDestination.locations ? (
                    <p className="mt-0.5 truncate text-xs text-ink-600">
                      {formatLocations(selectedDestination.locations)}
                    </p>
                  ) : null}
                </div>
                {selectedDestination.tag ? (
                  <span className="badge-brand shrink-0">{selectedDestination.tag}</span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-xl font-bold text-ink-900">
                  {formatPrice(perPersonPrice)}
                </span>
                {selectedDestination.price && selectedDestination.discountedPrice ? (
                  <span className="text-sm text-ink-500 line-through">
                    {formatPrice(selectedDestination.price)}
                  </span>
                ) : null}
                <span className="text-sm text-ink-600">per person</span>
              </div>

              <RecommendedDestinations
                destinationId={selectedDestination.id}
                mode="similar"
                title="You might also like"
              />
            </div>
          ) : null}

          <Field label="Travel date" htmlFor="date">
            <div className="relative">
              <CalendarDays
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                id="date"
                name="date"
                type="date"
                min={today}
                value={booking.date}
                onChange={handleBookingChange}
                className="input pl-10"
              />
            </div>
          </Field>

          <button
            type="button"
            disabled={!isStepOneValid}
            onClick={() => setStep(2)}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      ) : (
        <section className="space-y-5" aria-labelledby="travellers-heading">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="travellers-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
                Traveller details
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                Add everyone who is travelling.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-ghost shrink-0 !px-3 !py-2 text-sm"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </button>
          </div>

          {selectedDestination ? (
            <dl className="grid grid-cols-1 gap-3 rounded-2xl bg-ink-50 p-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">Package</dt>
                <dd className="mt-0.5 font-semibold text-ink-900">{selectedDestination.title}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">From</dt>
                <dd className="mt-0.5 font-semibold text-ink-900">{booking.from}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">Date</dt>
                <dd className="mt-0.5 font-semibold text-ink-900">
                  {parseDateInput(booking.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          ) : null}

          {travelers.length > 0 ? (
            <ul className="space-y-3" aria-label="Added travellers">
              {travelers.map((t, i) => (
                <li
                  key={`${t.name}-${i}`}
                  className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
                    editIndex === i
                      ? "border-brand-400 bg-brand-50"
                      : "border-ink-100 bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{t.name}</p>
                    <p className="text-sm text-ink-600">
                      {t.age} yrs · {t.gender} · {t.mobile}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => editTraveler(i)}
                      aria-label={`Edit ${t.name}`}
                      className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTraveler(i)}
                      aria-label={`Remove ${t.name}`}
                      className="rounded-lg p-2 text-ink-600 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="space-y-4 rounded-2xl border border-ink-100 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink-900">
                {editIndex !== null ? "Edit traveller" : `Traveller ${travelers.length + 1}`}
              </h3>
              {hasUnsavedDraft ? (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-ink-900"
                >
                  <X size={14} aria-hidden="true" />
                  Clear
                </button>
              ) : null}
            </div>

            <Field label="Full name" htmlFor="t-name" error={travelerErrors.name}>
              <input
                id="t-name"
                name="name"
                value={travelerDraft.name}
                onChange={handleTravelerChange}
                autoComplete="off"
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Age" htmlFor="t-age" error={travelerErrors.age}>
                <input
                  id="t-age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="120"
                  value={travelerDraft.age}
                  onChange={handleTravelerChange}
                  className="input"
                />
              </Field>
              <Field label="Gender" htmlFor="t-gender" error={travelerErrors.gender}>
                <select
                  id="t-gender"
                  name="gender"
                  value={travelerDraft.gender}
                  onChange={handleTravelerChange}
                  className="input"
                >
                  <option value="">Select</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Mobile number" htmlFor="t-mobile" error={travelerErrors.mobile}>
              <input
                id="t-mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                value={travelerDraft.mobile}
                onChange={handleTravelerChange}
                className="input"
              />
            </Field>

            <button type="button" onClick={addOrUpdateTraveler} className="btn-outline w-full">
              {editIndex !== null ? (
                <>
                  <Check size={18} aria-hidden="true" />
                  Update traveller
                </>
              ) : (
                <>
                  <UserPlus size={18} aria-hidden="true" />
                  Add traveller
                </>
              )}
            </button>
          </div>

          {selectedDestination && travelers.length > 0 ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-ink-900 p-4 text-white">
              <div>
                <p className="text-sm text-ink-300">
                  Estimated total · {travelers.length}{" "}
                  {travelers.length === 1 ? "traveller" : "travellers"}
                </p>
                <p className="text-xs text-ink-400">Final price is confirmed on booking.</p>
              </div>
              <p className="text-2xl font-extrabold">{formatPrice(estimatedTotal)}</p>
            </div>
          ) : null}

          {hasUnsavedDraft && travelers.length > 0 ? (
            <p className="text-xs text-ink-500">
              You have an unsaved traveller above. Add it first or clear it.
            </p>
          ) : null}

          <button
            type="button"
            disabled={!travelers.length || submitting}
            onClick={submitBooking}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Confirming…
              </>
            ) : (
              "Confirm booking"
            )}
          </button>
        </section>
      )}
    </div>
  );
}