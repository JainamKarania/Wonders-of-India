import { useEffect, useState } from "react";
import axios from "axios";
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
import { Close } from "@mui/icons-material";
import { supabase } from "../../lib/supabaseClient";

const ChangeTripModal = ({ booking, open, onClose, onUpdated }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [fromCity, setFromCity] = useState("");
  const [destinationId, setDestinationId] = useState("");

  useEffect(() => {
    if (!open || !booking) return;

    setFromCity(booking.fromCity || "");
    setDestinationId(booking.destinationId ?? "");
    setError(null);

    const loadDestinations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );
        if (!res.data.success) throw new Error(res.data.message);
        setDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [open, booking]);

  const selected = destinations.find((d) => d.id === Number(destinationId));
  const perPerson = selected ? selected.discountedPrice ?? selected.price ?? 0 : 0;
  const travelerCount = Math.max(booking?.travelers?.length ?? 1, 1);
  const estimatedTotal = perPerson * travelerCount;

  const unchanged =
    booking &&
    fromCity.trim() === (booking.fromCity || "") &&
    Number(destinationId) === booking.destinationId;

  const handleSave = async () => {
    if (!fromCity.trim() || !destinationId) {
      toast.error("Please enter a boarding station and pick a destination.");
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
      toast.error(err.response?.data?.message || "Failed to update trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent className="relative p-6">
        <IconButton
          onClick={onClose}
          aria-label="Close"
          className="!absolute right-3 top-3"
        >
          <Close />
        </IconButton>

        <h3 className="mb-1 text-xl font-bold text-slate-800">Change Trip</h3>
        <p className="mb-5 text-sm text-slate-500">
          Update your boarding station or destination. Your travel date and
          travelers stay the same.
        </p>

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
              label="Boarding station"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
            />

            <TextField
              select
              fullWidth
              label="Destination"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              {destinations.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.title}
                </MenuItem>
              ))}
            </TextField>

            {selected && (
              <div className="rounded-xl bg-orange-50 p-3 text-sm text-slate-700">
                <p>
                  ₹{perPerson.toLocaleString()} × {travelerCount} traveler
                  {travelerCount > 1 ? "s" : ""}
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  New total: ₹{estimatedTotal.toLocaleString()}
                </p>
              </div>
            )}

            <Button
              fullWidth
              variant="contained"
              disabled={saving || unchanged}
              onClick={handleSave}
              className="!rounded-xl !bg-orange-600 !py-3"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTripModal;