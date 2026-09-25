import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ItineraryModal = ({ open, onClose, destinationId }) => {
  const [selectedId, setSelectedId] = useState(destinationId);
  const [allDestinations, setAllDestinations] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedId(destinationId);
  }, [destinationId]);

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
      PaperProps={{ className: "!rounded-3xl overflow-hidden" }}
    >
      <DialogContent className="p-0 relative overflow-hidden">
        <IconButton
          onClick={onClose}
          className="!absolute top-4 right-4 z-[100]
             !bg-white/90 hover:!bg-white
             !text-slate-800 shadow-lg"
        >
          <MdClose size={20} />
        </IconButton>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
          {/* LEFT PANEL */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:p-10 flex flex-col gap-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
            />

            {loading ? (
              <div className="relative space-y-4">
                <Skeleton variant="text" width="70%" height={40} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                <Skeleton variant="rounded" height={240} sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 3 }} />
              </div>
            ) : detail ? (
              <>
                <div className="relative">
                  {detail.tag && (
                    <span className="inline-block mb-3 text-xs font-semibold px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                      {detail.tag}
                    </span>
                  )}
                  <Typography className="!text-2xl md:!text-3xl !font-extrabold leading-tight">
                    {detail.title}
                  </Typography>
                  {detail.duration && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-300">
                      <CalendarTodayIcon fontSize="small" className="text-orange-400" />
                      {detail.duration}
                    </div>
                  )}
                </div>

                {detail.image && (
                  <img
                    src={detail.image}
                    alt={detail.title}
                    className="relative rounded-2xl object-cover h-52 md:h-64 shadow-2xl border border-white/10"
                  />
                )}

                {detail.locations && (
                  <div className="relative flex items-start gap-2 text-sm">
                    <LocationOnIcon className="text-orange-400 mt-0.5" fontSize="small" />
                    <span className="leading-relaxed text-slate-200">
                      {detail.locations}
                    </span>
                  </div>
                )}

                {(detail.discountedPrice || detail.price) && (
                  <div className="relative flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-white">
                      ₹{(detail.discountedPrice ?? detail.price).toLocaleString()}
                    </span>
                    {detail.discountedPrice && detail.price && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{detail.price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">/ person</span>
                  </div>
                )}

                <Link to={`/booking?destinationId=${detail.id}`} className="relative mt-2">
                  <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-slate-900 hover:from-orange-600 hover:to-amber-500 transition">
                    Book This Package <ArrowForwardIcon fontSize="small" />
                  </button>
                </Link>

                <Typography className="relative mt-auto text-xs text-slate-400">
                  ✨ Switch itineraries below without closing this window
                </Typography>
              </>
            ) : (
              <Typography className="relative text-sm text-slate-300">
                {error || "Select a destination to view its itinerary."}
              </Typography>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 md:p-10 overflow-y-auto bg-orange-50/40">
            <TextField
              select
              fullWidth
              label="Choose another itinerary"
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="mb-8 bg-white rounded-xl"
            >
              {allDestinations.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.title}
                </MenuItem>
              ))}
            </TextField>

            <Typography className="!text-xl !font-bold mb-6 text-slate-800">
              Day-wise Itinerary
            </Typography>

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={72} className="!rounded-2xl" />
                ))}
              </div>
            )}

            {!loading && error && (
              <Typography className="text-sm text-red-600">{error}</Typography>
            )}

            {!loading && detail && detail.days.length === 0 && (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-6 text-center">
                <Typography className="text-sm text-slate-500">
                  Day-wise details for this package are coming soon.
                </Typography>
              </div>
            )}

            {!loading && detail && detail.days.length > 0 && (
              <div className="space-y-4">
                {detail.days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="flex gap-4 items-start rounded-2xl bg-white p-4 shadow-sm border border-orange-100 hover:shadow-md hover:-translate-y-0.5 transition"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white font-bold text-sm shadow">
                      {day.dayNumber}
                    </div>
                    <div>
                      <Typography className="!font-semibold !text-sm text-slate-800">
                        {day.title}
                      </Typography>
                      <Typography className="!text-xs text-slate-600 mt-1 leading-relaxed">
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