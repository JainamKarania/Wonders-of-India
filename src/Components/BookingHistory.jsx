import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useBooking from "../hooks/useBooking";
import { CheckCircle, ArrowRightAlt, Phone, CalendarToday, Route } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BookingHistory = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  // Get email from state or localStorage
  const email = state?.booking?.email || localStorage.getItem("woi_user_email");

  // Get bookings from hook
  const { booking: bookings } = useBooking(email);
  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  // Determine selected booking
  const selectedBookingId = state?.bookingId || null;
  const selectedBooking = bookingsArray.find((b) => b.bookingId === selectedBookingId) || bookingsArray[bookingsArray.length - 1];

  if (!selectedBooking) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-orange-50 px-4">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-slate-700">No booking found</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition"
          >
            Start a Booking
          </button>
        </div>
      </section>
    );
  }

  const { booking, travelers, status, bookingId, pricing } = selectedBooking;

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${bookingId}.pdf`);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-12">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-orange-500">Booking Confirmed</h1>
          <p className="text-slate-600 text-lg">
            Thank you for choosing <strong>Wonders Of India</strong>
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
          <CheckCircle fontSize="small" />
          {status}
        </span>
      </header>

      {/* Combined Card */}
      <section className="rounded-3xl bg-white shadow-2xl border border-orange-100 overflow-hidden p-6 sm:p-8">
        {/* Summary Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 sm:p-6 rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-slate-500">Booking ID</p>
              <p className="text-lg font-semibold text-slate-800">{bookingId}</p>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Route fontSize="small" />
              <span className="font-medium">
                {booking.from} <ArrowRightAlt className="mx-1 inline" /> {booking.to}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <CalendarToday fontSize="small" />
              <span className="font-medium">{new Date(booking.date).toDateString()}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-slate-700">
            <p>
              <span className="font-medium">Package:</span> {booking.package}
            </p>
            <p>
              <span className="font-medium">Email:</span> {booking.email}
            </p>
          </div>
        </div>

        {/* Passenger + Invoice Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Passenger Details */}
          <div className="flex-1 bg-white space-y-6">
            <h2 className="text-2xl font-semibold text-orange-500">Passenger Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {travelers.map((traveler, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-orange-200 p-4 bg-orange-50 shadow hover:shadow-lg transition"
                >
                  <p className="mb-2 text-xl font-semibold text-orange-600">{traveler.name}</p>
                  <p className="text-sm text-slate-700">
                    {traveler.age} yrs • {traveler.gender}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                    <Phone fontSize="small" /> {traveler.mobile}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Invoice */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">Invoice</h2>
            <div
              ref={invoiceRef}
              className="flex-1 bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="grid grid-cols-2 gap-4 text-black">
                <p>
                  <span className="font-medium">Package:</span> {booking.package}
                </p>
                <p>
                  <span className="font-medium">Number of Travelers:</span> {travelers.length}
                </p>
                <p>
                  <span className="font-medium">Price per Person:</span> ₹{pricing.perPerson.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Total Price:</span> ₹{pricing.total.toLocaleString()}
                </p>
              </div>
              <button
                onClick={downloadInvoice}
                className="mt-6 rounded-xl bg-orange-600 px-6 py-2 text-white font-semibold shadow hover:bg-orange-700 transition"
              >
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 flex justify-center">
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
