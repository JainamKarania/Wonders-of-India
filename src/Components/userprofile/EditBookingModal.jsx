import { useEffect, useState } from "react";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_orange.css";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  PersonAdd,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { supabase } from "../../lib/supabaseClient";

const GENDERS = ["Male", "Female", "Other"];
const EMPTY_TRAVELER = { name: "", age: "", gender: "", mobile: "" };

const EditBookingModal = ({ bookingId, open, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [fromCity, setFromCity] = useState("");
  const [travelDate, setTravelDate] = useState(null);
  const [travelersList, setTravelersList] = useState([]);
  const [travelerDraft, setTravelerDraft] = useState(EMPTY_TRAVELER);
  const [editIndex, setEditIndex] = useState(null);
  const [destinationTitle, setDestinationTitle] = useState("");

  useEffect(() => {
    if (!open || !bookingId) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
          { headers: { Authorization: `Bearer ${session?.access_token}` } }
        );

        if (!res.data.success) throw new Error(res.data.message);

        const b = res.data.data;
        setFromCity(b.fromCity || "");
        setTravelDate(new Date(b.travelDate));
        setTravelersList(
          b.travelers.map((t) => ({
            name: t.name,
            age: t.age ?? "",
            gender: t.gender ?? "",
            mobile: t.mobile ?? "",
          }))
        );
        setDestinationTitle(b.destination?.title || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [open, bookingId]);

  const addOrUpdateTraveler = () => {
    if (
      !travelerDraft.name ||
      !travelerDraft.age ||
      !travelerDraft.gender ||
      !travelerDraft.mobile
    ) {
      toast.error("Please fill all traveler details");
      return;
    }

    if (editIndex !== null) {
      setTravelersList((prev) =>
        prev.map((t, i) => (i === editIndex ? travelerDraft : t))
      );
      setEditIndex(null);
    } else {
      setTravelersList((prev) => [...prev, travelerDraft]);
    }
    setTravelerDraft(EMPTY_TRAVELER);
  };

  const editTraveler = (index) => {
    setTravelerDraft(travelersList[index]);
    setEditIndex(index);
  };

  const removeTraveler = (index) => {
    setTravelersList((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setTravelerDraft(EMPTY_TRAVELER);
    }
  };

  const handleSave = async () => {
    if (!travelDate || travelersList.length === 0) {
      toast.error("Travel date and at least one traveler are required.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          travelDate: travelDate.toISOString(),
          fromCity,
          travelers: travelersList,
        },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );

      if (!res.data.success) throw new Error(res.data.message);

      toast.success("Booking updated.");
      onUpdated(res.data.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent className="relative p-6">
        <IconButton onClick={onClose} className="!absolute right-3 top-3">
          <Close />
        </IconButton>

        <h3 className="text-xl font-bold text-slate-800 mb-1">Edit Booking</h3>
        {destinationTitle && (
          <p className="text-sm text-slate-500 mb-5">{destinationTitle}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress sx={{ color: "#ea580c" }} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-5">
            <TextField
              fullWidth
              label="From"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Travel Date
              </label>
              <Flatpickr
                value={travelDate}
                onChange={(dates) => setTravelDate(dates[0] || null)}
                options={{
                  minDate: "today",
                  dateFormat: "d M Y",
                  disableMobile: true,
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-3 rounded-xl border p-4">
              <p className="text-sm font-semibold text-slate-700">
                {editIndex !== null ? "Edit Traveler" : "Add Traveler"}
              </p>
              <TextField
                fullWidth
                label="Name"
                value={travelerDraft.name}
                onChange={(e) =>
                  setTravelerDraft({ ...travelerDraft, name: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Age"
                  value={travelerDraft.age}
                  onChange={(e) =>
                    setTravelerDraft({ ...travelerDraft, age: e.target.value })
                  }
                />
                <TextField
                  select
                  label="Gender"
                  value={travelerDraft.gender}
                  onChange={(e) =>
                    setTravelerDraft({ ...travelerDraft, gender: e.target.value })
                  }
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
                label="Mobile"
                value={travelerDraft.mobile}
                onChange={(e) =>
                  setTravelerDraft({ ...travelerDraft, mobile: e.target.value })
                }
              />
              <Button
                startIcon={<PersonAdd />}
                onClick={addOrUpdateTraveler}
                className="!text-orange-600"
              >
                {editIndex !== null ? "Update Traveler" : "Add Traveler"}
              </Button>
            </div>

            {travelersList.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border bg-green-50 p-3"
              >
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-slate-600">
                    {t.age} yrs • {t.gender} • {t.mobile}
                  </p>
                </div>
                <div className="flex gap-1">
                  <IconButton size="small" onClick={() => editTraveler(i)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => removeTraveler(i)}>
                    <DeleteIcon fontSize="small" className="text-red-600" />
                  </IconButton>
                </div>
              </div>
            ))}

            <Button
              fullWidth
              variant="contained"
              disabled={saving}
              onClick={handleSave}
              className="!bg-orange-600 !py-3 !rounded-xl"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingModal;