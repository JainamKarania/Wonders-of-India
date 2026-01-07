import HomeScreen from "./Components/HomeScreen";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import DestinationPage from "./pages/DestinationPage";
import Auth from "./Components/auth/Auth";
import BookingForm from "./booking/BookingForm.jsx";
import TransactionHistoryPage from "./pages/TransactionHistoryPage.jsx";
import ProtectedRoute from "./Components/routes/ProtectedRoute.jsx";
import Itineraries from "./Components/itinearies/Itineraries.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ItinerariesPage from "./pages/ItineariesPage.jsx";
import BookingHistoryPage from "./pages/BookingHistoryPage.jsx";
function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/booking"
              element={
                // <ProtectedRoute>
                  <BookingPage />
                // </ProtectedRoute>
              }
            />

            <Route index element={<HomeScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/aboutpage" element={<AboutPage />} />
            {/* <Route path ='/booking' element = {<BookingPage/>}/> */}
            <Route path="/booking-form" element={<BookingForm />} />
            <Route path="/destination" element={<DestinationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<Auth />}></Route>
            <Route path="/itineary" element={<ItinerariesPage />} />
            <Route path="/booking-history" element={<BookingHistoryPage />} />
            <Route path="/transaction-history" element={<TransactionHistoryPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
