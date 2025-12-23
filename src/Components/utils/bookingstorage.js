export const saveBooking = (booking) => {
  const history = JSON.parse(localStorage.getItem("bookingHistory")) || [];
  localStorage.setItem("bookingHistory", JSON.stringify([...history, booking]));
};

export const getBookingHistory = () =>
  JSON.parse(localStorage.getItem("bookingHistory")) || [];
