import HomeScreen from "./Components/HomeScreen";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import DestinationPage from "./pages/DestinationPage";
import Auth from "./Components/auth/Auth";
import ProtectedRoute from "./Components/routes/ProtectedRoute.jsx";
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
            <Route path="/destination" element={<DestinationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<Auth />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
