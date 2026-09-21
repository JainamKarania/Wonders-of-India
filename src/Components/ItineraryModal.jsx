import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  Typography,
  MenuItem,
  TextField,
  IconButton,
  Skeleton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ItineraryModal = ({ open, onClose, destinationId }) => {
  const [selectedId, setSelectedId] = useState(destinationId);
  const [allDestinations, setAllDestinations] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep in sync if the parent opens this modal for a different
  // destination while it's already mounted.
  useEffect(() => {
    setSelectedId(destinationId);
  }, [destinationId]);

  // Fetch the list of destinations once, for the "switch itinerary"
  // dropdown — lightweight, doesn't include day-wise content.
  useEffect(() => {
    if (!open) return;

    const fetchList = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );
        setAllDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchList();
  }, [open]);

  // Fetch the full detail (destination + real day-wise itinerary)
  // whenever the selected destination changes.
  useEffect(() => {
    if (!open || !selectedId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/itinerary?destinationId=${selectedId}`
        );
        if (!res.data.success) throw new Error(res.data.message);
        setDetail(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load this itinerary.");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, selectedId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className="backdrop-blur-sm"
    >
      <DialogContent className="p-0 relative overflow-hidden">
        <IconButton
          onClick={onClose}
          className="!absolute -top-4 -right-4 z-[100]
             bg-orange-500 hover:bg-orange-600
             text-white shadow-xl"
        >
          <MdClose size={22} />
        </IconButton>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:p-8 flex flex-col gap-6">
            {loading ? (
              <>
                <Skeleton variant="text" width="70%" height={36} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="rounded" height={224} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
              </>
            ) : detail ? (
              <>
                <div>
                  <Typography className="text-2xl font-bold">
                    {detail.title}
                  </Typography>
                  {detail.duration && (
                    <Typography className="text-sm text-slate-300 mt-1">
                      {detail.duration}
                    </Typography>
                  )}
                </div>

                {detail.image && (
                  <img
                    src={detail.image}
                    alt={detail.title}
                    className="rounded-2xl object-cover h-56 md:h-64 shadow-lg"
                  />
                )}

                {detail.locations && (
                  <div className="flex items-start gap-2 text-sm">
                    <LocationOnIcon className="text-orange-400 mt-0.5" />
                    <span className="leading-relaxed">{detail.locations}</span>
                  </div>
                )}

                <Typography className="mt-auto text-xs text-slate-400">
                  ✨ Switch itineraries without closing this modal
                </Typography>
              </>
            ) : (
              <Typography className="text-sm text-slate-300">
                {error || "Select a destination to view its itinerary."}
              </Typography>
            )}
          </div>

          <div className="p-6 md:p-8 overflow-y-auto bg-white">
            <TextField
              select
              fullWidth
              label="Choose another itinerary"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="mb-6"
            >
              {allDestinations.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.title}
                </MenuItem>
              ))}
            </TextField>

            <Typography className="text-xl font-bold mb-6">
              Day-wise Itinerary
            </Typography>

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={50} />
                ))}
              </div>
            )}

            {!loading && error && (
              <Typography className="text-sm text-red-600">{error}</Typography>
            )}

            {!loading && detail && detail.days.length === 0 && (
              <Typography className="text-sm text-slate-500">
                Day-wise details for this package are coming soon.
              </Typography>
            )}

            {!loading && detail && detail.days.length > 0 && (
              <div className="space-y-5">
                {detail.days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="flex gap-4 items-start pb-4 border-b last:border-none"
                  >
                    <div>
                      <Typography className="font-semibold text-sm">
                        Day {day.dayNumber} — {day.title}
                      </Typography>
                      <Typography className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {day.description}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItineraryModal;