import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  ArrowRightAlt,
  Phone,
  CalendarToday,
  Route,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../Components/context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const formatBookingRef = (id) => `WOI-${String(id).padStart(6, "0")}`;

const BookingHistory = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const invoiceRefs = useRef({});

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings`,
          { headers: { Authorization: `Bearer ${session?.access_token}` } }
        );

        setBookings(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, navigate]);

  const downloadInvoice = async (bookingId) => {
    const node = invoiceRefs.current[bookingId];
    if (!node) return;

    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${formatBookingRef(bookingId)}.pdf`);
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={280} className="!rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center bg-orange-50 px-4 rounded-3xl">
        <p className="text-slate-600">{error}</p>
      </section>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-orange-50 px-4 rounded-3xl">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-slate-700">No bookings yet</p>
          <button
            onClick={() => navigate("/destination")}
            className="rounded-xl bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition"
          >
            Start a Booking
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="space-y-12">
      {bookings.map((booking) => {
        const perPerson =
          booking.destination.discountedPrice ?? booking.destination.price ?? 0;

        return (
          <section
            key={booking.id}
            className="rounded-3xl bg-white shadow-2xl border border-orange-100 overflow-hidden p-6 sm:p-8"
          >
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">Booking ID</p>
                <p className="text-lg font-semibold text-slate-800">
                  {formatBookingRef(booking.id)}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700 capitalize">
                <CheckCircle fontSize="small" />
                {booking.status}
              </span>
            </header>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 sm:p-6 rounded-2xl mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Route fontSize="small" />
                  <span className="font-medium">
                    {booking.fromCity}
                    <ArrowRightAlt className="mx-1 inline" />
                    {Array.isArray(booking.destination.locations)
                      ? booking.destination.locations.join(", ")
                      : booking.destination.locations}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarToday fontSize="small" />
                  <span className="font-medium">
                    {new Date(booking.travelDate).toDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-slate-700">
                <p>
                  <span className="font-medium">Package:</span>{" "}
                  {booking.destination.title}
                </p>
                <p>
                  <span className="font-medium">Account:</span> {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 bg-white space-y-6">
                <h2 className="text-2xl font-semibold text-orange-500">
                  Passenger Details
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {booking.travelers.map((traveler) => (
                    <article
                      key={traveler.id}
                      className="rounded-xl border border-orange-200 p-4 bg-orange-50 shadow hover:shadow-lg transition"
                    >
                      <p className="mb-2 text-xl font-semibold text-orange-600">
                        {traveler.name}
                      </p>
                      <p className="text-sm text-slate-700">
                        {traveler.age} yrs • {traveler.gender}
                      </p>
                      {traveler.mobile && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                          <Phone fontSize="small" /> {traveler.mobile}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-orange-600 mb-4">
                  Invoice
                </h2>
                <div
                  ref={(el) => (invoiceRefs.current[booking.id] = el)}
                  className="flex-1 bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-lg"
                >
                  <div className="grid grid-cols-2 gap-4 text-black">
                    <p>
                      <span className="font-medium">Package:</span>{" "}
                      {booking.destination.title}
                    </p>
                    <p>
                      <span className="font-medium">Number of Travelers:</span>{" "}
                      {booking.travelers.length}
                    </p>
                    <p>
                      <span className="font-medium">Price per Person:</span> ₹
                      {perPerson.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Total Price:</span> ₹
                      {booking.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadInvoice(booking.id)}
                    className="mt-6 rounded-xl bg-orange-600 px-6 py-2 text-white font-semibold shadow hover:bg-orange-700 transition"
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <div className="flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="rounded-2xl bg-orange-600 px-10 py-3 text-white font-semibold shadow-lg hover:bg-orange-700 transition"
        >
          Book Another Trip
        </button>
      </div>
    </main>
  );
};

export default BookingHistory;