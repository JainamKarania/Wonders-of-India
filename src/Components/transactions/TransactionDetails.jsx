import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  ErrorOutline,
  ReceiptLong,
  LocationOn,
  CalendarToday,
  Payments,
  TravelExplore,
} from "@mui/icons-material";
import gsap from "gsap";

/* -------------------- MOCK TRANSACTIONS -------------------- */
const TRANSACTIONS = [
  {
    transactionId: "WOI-TXN-784512",
    bookingId: "WOI-BKG-21984",
    from: "Mumbai",
    to: "Jaipur",
    journeyDate: "15 Feb 2025",
    paymentDate: "10 Jan 2025",
    amount: 24999,
    paymentMethod: "UPI",
    bookingStatus: "Confirmed",
    paymentStatus: "Completed",
    email: "jainam.karania@example.com",
  },
  {
    transactionId: "WOI-TXN-784513",
    bookingId: "WOI-BKG-21985",
    from: "Delhi",
    to: "Goa",
    journeyDate: "02 Feb 2025",
    paymentDate: null,
    amount: 18999,
    paymentMethod: "Card",
    bookingStatus: "Pending Confirmation",
    paymentStatus: "Payment In Progress",
    email: "rohit.sharma@example.com",
  },
  {
    transactionId: "WOI-TXN-784514",
    bookingId: "WOI-BKG-21986",
    from: "Ahmedabad",
    to: "Leh",
    journeyDate: "22 Mar 2025",
    paymentDate: null,
    amount: 32999,
    paymentMethod: "Net Banking",
    bookingStatus: "Cancelled",
    paymentStatus: "Failed",
    email: "ananya.singh@example.com",
  },
];

export default function TransactionsDetails() {
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    gsap.fromTo(
      ".booking-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power3.out" }
    );
  }, [activeTab]);

  const filteredTransactions = TRANSACTIONS.filter(
    (t) =>
      (activeTab === "completed" && t.paymentStatus === "Completed") ||
      (activeTab === "in-progress" &&
        t.paymentStatus === "Payment In Progress") ||
      (activeTab === "failed" && t.paymentStatus === "Failed")
  );

  const handleInvoiceDownload = (txnId) => {
    console.log("Downloading invoice for:", txnId);
  };

  return (
    <section className="p-6 md:p-8 bg-gray-50 rounded-3xl shadow-lg">
      {/* Header */}
      <header className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-900">
          <TravelExplore className="text-gray-700" />
          Transactions & Bookings
        </h2>
        <p className="mt-1 text-gray-600 text-sm md:text-base max-w-2xl">
          All your trip transactions and booking details with{" "}
          <span className="font-semibold text-gray-800">Wonders of India</span>.
        </p>
      </header>

      {/* Tabs */}
      <nav className="mb-6 flex flex-wrap gap-3">
        {[
          { key: "in-progress", label: "Payment In Progress" },
          { key: "completed", label: "Completed Transactions" },
          { key: "failed", label: "Failed Transactions" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gray-800 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Booking Cards */}
      <div className="flex flex-col gap-4">
        {filteredTransactions.map((txn) => (
          <article
            key={txn.transactionId}
            className="booking-card relative flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition"
          >
            {/* Left accent bar */}
            <span className="absolute left-0 top-0 h-full w-1 bg-gray-700" />

            {/* Left Section: IDs & Email */}
            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between gap-2">
              <p className="text-xs text-gray-400">Transaction ID</p>
              <p className="font-semibold text-gray-800 truncate">
                {txn.transactionId}
              </p>

              <p className="text-xs text-gray-400 mt-1">Booking ID</p>
              <p className="font-medium text-gray-700 truncate">{txn.bookingId}</p>

              <p className="text-xs text-gray-400 mt-1">Email</p>
              <p className="font-medium text-gray-700 truncate">{txn.email}</p>
            </div>

            {/* Middle Section: Journey & Booking Status */}
            <div className="flex-1 p-4 md:p-5 flex flex-col justify-center gap-2 border-l border-gray-200 md:border-l-0 md:border-r md:border-gray-200">
              <p className="text-xs text-gray-400">Journey Details</p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <LocationOn className="text-gray-700" fontSize="small" />
                {txn.from} → {txn.to}
              </p>

              <p className="text-xs text-gray-400 mt-1">Journey Date</p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarToday className="text-gray-700" fontSize="small" />
                {txn.journeyDate}
              </p>

              <p className="text-xs text-gray-400 mt-1">Booking Status</p>
              <p className="text-sm">
                <span
                  className={`font-semibold ${
                    txn.bookingStatus === "Confirmed"
                      ? "text-emerald-600"
                      : txn.bookingStatus === "Cancelled"
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  {txn.bookingStatus}
                </span>
              </p>
            </div>

            {/* Right Section: Redesigned */}
            <div className="flex-1 p-4 md:p-5 flex flex-col justify-between items-end text-right">
              {/* Payment Method */}
              <div className="mb-2">
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1 justify-end">
                  <Payments fontSize="small" className="text-gray-700" />
                  {txn.paymentMethod}
                </p>
              </div>

              {/* Amount Paid / Pending */}
              <div className="mb-2">
                <p className="text-xs text-gray-400">Amount</p>
                <p className="font-semibold text-gray-800">
                  ₹{txn.amount.toLocaleString()}
                </p>
              </div>

              {/* Payment Status & Invoice */}
              <div className="flex items-center gap-2 mt-2">
                <Chip
                  icon={
                    txn.paymentStatus === "Completed" ? (
                      <CheckCircle />
                    ) : txn.paymentStatus === "Failed" ? (
                      <ErrorOutline />
                    ) : (
                      <HourglassEmpty />
                    )
                  }
                  label={txn.paymentStatus}
                  color={
                    txn.paymentStatus === "Completed"
                      ? "success"
                      : txn.paymentStatus === "Failed"
                      ? "error"
                      : "warning"
                  }
                  size="small"
                />
                {txn.paymentStatus === "Completed" && (
                  <button
                    onClick={() => handleInvoiceDownload(txn.transactionId)}
                    className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
                  >
                    <ReceiptLong fontSize="small" />
                    Invoice
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
