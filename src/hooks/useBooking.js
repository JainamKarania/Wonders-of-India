import { useState } from "react";
import { calculateTotalPrice } from "../Components/utils/pricing";

const useBooking = () => {
  const [booking, setBooking] = useState({
    whereFrom: "",
    destination: "",
    packageName: "",
    travelDate: null,
    persons: [],
  });

  const addPerson = (person) =>
    setBooking((prev) => ({ ...prev, persons: [...prev.persons, person] }));

  const totalPrice = calculateTotalPrice(booking.persons);

  return { booking, setBooking, addPerson, totalPrice };
};

export default useBooking;
