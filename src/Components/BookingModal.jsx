import ModalWrapper from "./ModalWrapper";
import BookingForm from "../booking/BookingForm";

// BookingForm is fully self-contained — it manages its own state, submits
// directly to /api/bookings, and navigates to /booking-history itself on
// success. This modal is just a container to open that same form without
// leaving the current page; it no longer needs its own booking state,
// submit handler, or traveler modal — BookingForm already does all of it.
const BookingModal = ({ open, onClose }) => {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Wonders of India – Booking
      </h2>

      <BookingForm />
    </ModalWrapper>
  );
};

export default BookingModal;