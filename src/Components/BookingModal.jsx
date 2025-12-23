import { Button } from "@mui/material";
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import ModalWrapper from "./ModalWrapper";
import BookingForm from "../booking/BookingForm";
import AddPersonModal from "../booking/AddPersonModal";
import PriceSummary from "../booking/PriceSummary";
import useBooking from "../hooks/useBooking";
import { saveBooking } from "../Components/utils/bookingstorage";
import toast from "react-hot-toast";

const BookingModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { booking, setBooking, addPerson, totalPrice } = useBooking();
  const [addPersonOpen, setAddPersonOpen] = useState(false);

  const handleSubmit = () => {
    saveBooking({
      ...booking,
      totalPrice,
      status: "Confirmed",
      id: Date.now(),
    });

    toast.success("🎉 Booking confirmed! Welcome to Wonders of India");

    onClose();

    setTimeout(() => {
      navigate("/booking-history");
    }, 1500);
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Wonders of India – Booking
      </h2>

      <BookingForm booking={booking} setBooking={setBooking} />

      <Button fullWidth onClick={() => setAddPersonOpen(true)} className="mt-4">
        Add Traveller
      </Button>

      {booking.persons.length > 0 && (
        <PriceSummary persons={booking.persons} total={totalPrice} />
      )}

      <Button
        variant="contained"
        fullWidth
        className="mt-4"
        onClick={handleSubmit}
      >
        Confirm Booking
      </Button>

      <AddPersonModal
        open={addPersonOpen}
        onClose={() => setAddPersonOpen(false)}
        onAdd={addPerson}
      />
    </ModalWrapper>
  );
};

export default BookingModal;
