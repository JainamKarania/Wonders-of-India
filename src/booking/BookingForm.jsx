import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import "flatpickr/dist/themes/material_orange.css";
import {
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  LocationOn,
  Route,
  Email,
  PersonAdd,
  Edit,
} from "@mui/icons-material";

/* -------------------- DESTINATIONS DATA -------------------- */
const DESTINATIONS = Object.freeze([
  {
    name: "Jaipur, Rajasthan",
    desc: "Experience royal palaces, vibrant bazaars, and rich heritage in the Pink City.",
    package: "Jaipur Royal Heritage Tour",
    originalPrice: 34999,
    discountedPrice: 27999,
    tag: "Best Seller",
  },
  {
    name: "Goa",
    desc: "Golden beaches, nightlife, and relaxed vibes with the perfect tropical escape.",
    package: "Goa Sun & Sand Getaway",
    originalPrice: 29999,
    discountedPrice: 23999,
    tag: "Hot Deal",
  },
  {
    name: "Manali, Himachal Pradesh",
    desc: "Snow-capped mountains, adventure sports, and scenic valleys await you.",
    package: "Manali Himalayan Adventure Escape",
    originalPrice: 39999,
    discountedPrice: 31999,
    tag: "Recommended",
  },
]);

const GENDERS = ["Male", "Female", "Other"];
const EMPTY_TRAVELER = { name: "", age: "", gender: "", mobile: "" };

/* -------------------- COMPONENT -------------------- */
const BookingForm = () => {
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    from: "",
    to: "",
    email: "",
    package: "",
    date: null,
  });
  const [travelerDraft, setTravelerDraft] = useState(EMPTY_TRAVELER);
  const [travelers, setTravelers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  /* ---------- HANDLERS ---------- */
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
    if (!Object.values(travelerDraft).every(Boolean)) {
      toast.error("Please fill all traveler details");
      return;
    }

    if (editIndex !== null) {
      setTravelers((prev) =>
        prev.map((t, i) => (i === editIndex ? travelerDraft : t))
      );
      toast.success("Traveler updated");
      setEditIndex(null);
    } else {
      setTravelers((prev) => [...prev, travelerDraft]);
      toast.success("Traveler added");
    }

    setTravelerDraft(EMPTY_TRAVELER);
  };

  const editTraveler = (index) => {
    setTravelerDraft(travelers[index]);
    setEditIndex(index);
  };

  /* ---------- PACKAGE & PRICING ---------- */
  const selectedPackage = useMemo(() => {
    return DESTINATIONS.find((d) => d.package === booking.package);
  }, [booking.package]);

  const totalPrice = useMemo(() => {
    if (!selectedPackage) return 0;
    return travelers.length * selectedPackage.discountedPrice;
  }, [travelers.length, selectedPackage]);

  /* ---------- VALIDATION ---------- */
  const isStepOneValid = useMemo(() => {
    return (
      booking.from &&
      booking.to &&
      booking.email &&
      booking.package &&
      booking.date instanceof Date
    );
  }, [booking]);

  /* ---------- SUBMIT ---------- */
  const submitBooking = () => {
    toast.success("🎉 Booking confirmed! Redirecting...");

    const bookingEntry = {
      booking,
      travelers,
      status: "Confirmed",
      bookingId: `WOI-${Date.now()}`,
      pricing: { perPerson: selectedPackage.discountedPrice, total: totalPrice },
      createdAt: new Date().toISOString(),
    };

    const storedBookings = JSON.parse(localStorage.getItem(booking.email) || "[]");
    localStorage.setItem(booking.email, JSON.stringify([...storedBookings, bookingEntry]));

    setTimeout(() => {
      navigate("/booking-history", {
        state: {
          booking,
          travelers,
          status: "Confirmed",
          bookingId: `WOI-${Date.now()}`,
          pricing: {
            perPerson: selectedPackage.discountedPrice,
            total: totalPrice,
          },
        },
      });
    }, 1200);
  };

  /* ---------- UI ---------- */
  return (
    <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl overflow-hidden min-h-[760px]">

      {/* ================= STEP 1 ================= */}
      <section
        className={`space-y-5 transition-all duration-500 ${
          step === 1
            ? "opacity-100 translate-x-0"
            : "absolute inset-0 opacity-0 -translate-x-full"
        }`}
      >
        <h2 className="text-2xl font-bold text-slate-800">Start Your Journey</h2>

        <TextField
          fullWidth
          label="From"
          name="from"
          value={booking.from}
          onChange={handleBookingChange}
          InputProps={{ startAdornment: <Route className="mr-2" /> }}
        />

        <TextField
          fullWidth
          label="To"
          name="to"
          value={booking.to}
          onChange={handleBookingChange}
          InputProps={{ startAdornment: <LocationOn className="mr-2" /> }}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={booking.email}
          onChange={handleBookingChange}
          InputProps={{ startAdornment: <Email className="mr-2" /> }}
        />

        {/* ---------- PACKAGE SELECTION ---------- */}
        <TextField
          select
          fullWidth
          label="Select Package"
          name="package"
          value={booking.package}
          onChange={handleBookingChange}
        >
          {DESTINATIONS.map((dest) => (
            <MenuItem key={dest.package} value={dest.package}>
              <div className="flex flex-col">
                <span className="font-medium">{dest.package}</span>
                <span className="text-xs text-slate-500">
                  {dest.name} • ₹{dest.discountedPrice.toLocaleString()} / person
                </span>
              </div>
            </MenuItem>
          ))}
        </TextField>

        {/* ---------- SELECTED PACKAGE DETAILS ---------- */}
        {selectedPackage && (
          <div className="rounded-xl border bg-orange-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-800">{selectedPackage.package}</p>
              <span className="rounded-full bg-orange-600 px-3 py-1 text-xs text-white">
                {selectedPackage.tag}
              </span>
            </div>
            <p className="text-sm text-slate-600">{selectedPackage.desc}</p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-green-700">
                ₹{selectedPackage.discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 line-through">
                ₹{selectedPackage.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm text-green-600 font-medium">per person</span>
            </div>
          </div>
        )}

        {/* ---------- DATE ---------- */}
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

      {/* ================= STEP 2 ================= */}
      <section
        className={`space-y-6 transition-all duration-500 ${
          step === 2
            ? "opacity-100 translate-x-0"
            : "absolute inset-0 opacity-0 translate-x-full"
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
                <MenuItem key={g} value={g}>{g}</MenuItem>
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

        {/* ---------- Traveler Cards ---------- */}
        {travelers.map((t, i) => (
          <div key={i} className="rounded-xl border bg-green-50 p-4 space-y-2 flex justify-between items-center text-slate-800">
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-slate-600">{t.age} yrs • {t.gender}</p>
              <p className="text-sm">{t.mobile}</p>
            </div>
            <IconButton onClick={() => editTraveler(i)}>
              <Edit />
            </IconButton>
          </div>
        ))}

        {/* ---------- Total Price ---------- */}
        {selectedPackage && travelers.length > 0 && (
          <div className="rounded-xl bg-slate-100 p-4 flex justify-between items-center">
            <p className="text-slate-700 font-medium">
              Total Price ({travelers.length} Travelers)
            </p>
            <p className="text-xl font-bold text-green-700">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
        )}

        <Button
          fullWidth
          disabled={!travelers.length}
          onClick={submitBooking}
          className="!bg-green-600 !text-white !py-3 !rounded-xl"
        >
          Confirm Booking
        </Button>
      </section>
    </div>
  );
};

export default BookingForm;
