import ModalWrapper from "./ModalWrapper";
import BookingForm from "../booking/BookingForm";


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