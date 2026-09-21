import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import "flatpickr/dist/themes/material_orange.css";
import {
  TextField,
  Button,
  MenuItem,
  IconButton,
  Skeleton,
} from "@mui/material";
import { LocationOn, Email, PersonAdd, Edit } from "@mui/icons-material";
import { useAuth } from "../Components/context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import RecommendedDestinations from "../recommendations/RecommendedDestinations";

const GENDERS = ["Male", "Female", "Other"];
const EMPTY_TRAVELER = { name: "", age: "", gender: "", mobile: "" };

const BookingForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({ from: "", destinationId: "", date: null });
  const [travelerDraft, setTravelerDraft] = useState(EMPTY_TRAVELER);
  const [travelers, setTravelers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [destinations, setDestinations] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [destinationsError, setDestinationsError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setDestinationsLoading(true);
        setDestinationsError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );
        setDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        setDestinationsError("Failed to load packages. Please try again.");
      } finally {
        setDestinationsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // If arriving from a "Book Package" link elsewhere on the site
  // (?destinationId=X), preselect it once the real destination list has
  // loaded — only if the id is actually valid and nothing's picked yet.
  useEffect(() => {
    if (destinationsLoading || booking.destinationId) return;

    const idFromUrl = searchParams.get("destinationId");
    if (!idFromUrl) return;

    const exists = destinations.some((d) => String(d.id) === idFromUrl);
    if (exists) {
      setBooking((prev) => ({ ...prev, destinationId: idFromUrl }));
    }
  }, [destinationsLoading, destinations, searchParams, booking.destinationId]);

  const handleBookingChange = useCallback((e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleTravelerChange = useCallback((e) => {
    const { name, value } = e.target;
    setTravelerDraft((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((dates) => {
    setBooking((prev) => ({ ...prev, date: dates[0] || null }));
  }, []);

  const addOrUpdateTraveler = () => {
    if (!travelerDraft.name || !travelerDraft.age || !travelerDraft.gender || !travelerDraft.mobile) {
      toast.error("Please fill all traveler details");
      return;
    }

    if (editIndex !== null) {
      setTravelers((prev) =>
        prev.map((t, i) => (i === editIndex ? travelerDraft : t))
      );
      setEditIndex(null);
    } else {
      setTravelers((prev) => [...prev, travelerDraft]);
    }

    setTravelerDraft(EMPTY_TRAVELER);
  };

  const editTraveler = (index) => {
    setTravelerDraft(travelers[index]);
    setEditIndex(index);
  };

  const selectedDestination = useMemo(
    () => destinations.find((d) => String(d.id) === String(booking.destinationId)),
    [destinations, booking.destinationId]
  );

  const perPersonPrice = selectedDestination
    ? selectedDestination.discountedPrice ?? selectedDestination.price ?? 0
    : 0;

  // Shown to the user as a preview only — the real total is always
  // recalculated server-side from the destination's actual price when
  // the booking is submitted, so this can never be tampered with to
  // change what actually gets charged.
  const estimatedTotal = travelers.length * perPersonPrice;

  const isStepOneValid =
    booking.from &&
    booking.destinationId &&
    booking.date instanceof Date;

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
          fromCity: booking.from,
          travelDate: booking.date.toISOString(),
          travelers,
        },
        {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Booking failed");
      }

      toast.success("🎉 Booking confirmed! Redirecting...");
      setTimeout(() => {
        navigate("/booking-history", { replace: true });
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl overflow-hidden min-h-[760px]">
      <section
        className={`space-y-5 transition-all duration-500 ${
          step === 1 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 -translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold text-slate-800">Start Your Journey</h2>

        <TextField
          fullWidth
          label="From"
          name="from"
          value={booking.from}
          onChange={handleBookingChange}
          InputProps={{ startAdornment: <LocationOn className="mr-2" /> }}
        />

        {!user && (
          <p className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3">
            You'll need to sign in to complete a booking — you can browse
            packages first.
          </p>
        )}

        {destinationsLoading && (
          <Skeleton variant="rounded" height={56} />
        )}

        {!destinationsLoading && destinationsError && (
          <p className="text-sm text-red-600">{destinationsError}</p>
        )}

        {!destinationsLoading && !destinationsError && (
          <TextField
            select
            fullWidth
            label="Select Package"
            name="destinationId"
            value={booking.destinationId}
            onChange={handleBookingChange}
          >
            {destinations.map((dest) => (
              <MenuItem key={dest.id} value={dest.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{dest.title}</span>
                  <span className="text-xs text-slate-500">
                    {Array.isArray(dest.locations)
                      ? dest.locations.join(", ")
                      : dest.locations}{" "}
                    • ₹{(dest.discountedPrice ?? dest.price ?? 0).toLocaleString()} / person
                  </span>
                </div>
              </MenuItem>
            ))}
          </TextField>
        )}

        {selectedDestination && (
          <div className="rounded-xl border bg-orange-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-800">{selectedDestination.title}</p>
              {selectedDestination.tag && (
                <span className="rounded-full bg-orange-600 px-3 py-1 text-xs text-white">
                  {selectedDestination.tag}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-green-700">
                ₹{perPersonPrice.toLocaleString()}
              </span>
              {selectedDestination.price && selectedDestination.discountedPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{selectedDestination.price.toLocaleString()}
                </span>
              )}
              <span className="text-sm text-green-600 font-medium">per person</span>
            </div>
            <RecommendedDestinations
              destinationId={selectedDestination.id}
              mode="similar"
              title="You might also like"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Travel Date</label>
          <Flatpickr
            value={booking.date}
            onChange={handleDateChange}
            options={{ minDate: "today", dateFormat: "d M Y", disableMobile: true }}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Select available date"
          />
        </div>

        <Button
          fullWidth
          disabled={!isStepOneValid}
          onClick={() => setStep(2)}
          className="!bg-orange-600 !text-white !py-3 !rounded-xl"
        >
          Start Booking →
        </Button>
      </section>

      <section
        className={`space-y-6 transition-all duration-500 ${
          step === 2 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold text-slate-800">Traveller Details</h2>
        <div className="space-y-4 rounded-xl border p-4">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={travelerDraft.name}
            onChange={handleTravelerChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Age"
              name="age"
              value={travelerDraft.age}
              onChange={handleTravelerChange}
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={travelerDraft.gender}
              onChange={handleTravelerChange}
            >
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={travelerDraft.mobile}
            onChange={handleTravelerChange}
          />
          <Button startIcon={<PersonAdd />} onClick={addOrUpdateTraveler} className="!text-orange-600">
            {editIndex !== null ? "Update Traveler" : "Add Traveler"}
          </Button>
        </div>

        {travelers.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border bg-green-50 p-4 space-y-2 flex justify-between items-center text-slate-800"
          >
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-slate-600">
                {t.age} yrs • {t.gender}
              </p>
              <p className="text-sm">{t.mobile}</p>
            </div>
            <IconButton onClick={() => editTraveler(i)}>
              <Edit />
            </IconButton>
          </div>
        ))}

        {selectedDestination && travelers.length > 0 && (
          <div className="rounded-xl bg-slate-100 p-4 flex justify-between items-center">
            <p className="text-slate-700 font-medium">
              Estimated Total ({travelers.length} Travelers)
            </p>
            <p className="text-xl font-bold text-green-700">
              ₹{estimatedTotal.toLocaleString()}
            </p>
          </div>
        )}

        <Button
          fullWidth
          disabled={!travelers.length || submitting}
          onClick={submitBooking}
          className="!bg-green-600 !text-white !py-3 !rounded-xl"
        >
          {submitting ? "Confirming..." : "Confirm Booking"}
        </Button>
      </section>
    </div>
  );
};

export default BookingForm;