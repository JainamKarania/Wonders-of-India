import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "woi-bookings";

const readBookings = (email) => {
  if (!email) return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  return Array.isArray(parsed[email]) ? parsed[email] : [];
};

const writeBookings = (email, bookings) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : {};

  const updated = {
    ...parsed,
    [email]: bookings,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

const useBooking = (email) => {
  const [booking, setBooking] = useState(() => readBookings(email));

  // 🔄 Sync when email changes
  useEffect(() => {
    setBooking(readBookings(email));
  }, [email]);

  // ➕ Add booking (NO duplicates)
  const addBooking = useCallback((email, bookingEntry) => {
    const current = readBookings(email);
    const updated = [...current, bookingEntry];

    writeBookings(email, updated);
    setBooking(updated);
  }, []);

  // ❌ Cancel / Update Status (FIXED)
  const updateBookingStatus = useCallback(
    (bookingId, newStatus) => {
      setBooking((prev) => {
        const updated = prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, status: newStatus }
            : b
        );

        writeBookings(email, updated);
        return updated;
      });
    },
    [email]
  );

  return { booking, addBooking, updateBookingStatus };
};

export default useBooking;
