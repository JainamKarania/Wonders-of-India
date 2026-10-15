import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import HomeScreen from "./Components/HomeScreen";
import ProtectedRoute from "./Components/routes/ProtectedRoute.jsx";
import ChatWidget from "./chat/ChatWidget.jsx";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DestinationPage = lazy(() => import("./pages/DestinationPage"));
const BookingHistoryPage = lazy(() => import("./pages/BookingHistoryPage.jsx"));
const TransactionHistoryPage = lazy(() =>
  import("./pages/TransactionHistoryPage.jsx")
);
const UserProfilePage = lazy(() => import("./pages/UserProfilePage.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const Auth = lazy(() => import("./Components/auth/Auth"));
const BookingForm = lazy(() => import("./booking/BookingForm.jsx"));

const HIDE_WIDGET_ON = ["/chat", "/auth"];

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-ink-50"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
        This route isn't on our map
      </h1>
      <p className="section-subtitle mx-auto">
        The page you're looking for has moved or never existed.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </main>
  );
}

function AppRoutes() {
  const { pathname } = useLocation();
  const showWidget = !HIDE_WIDGET_ON.includes(pathname);

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route index element={<HomeScreen />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/aboutpage" element={<AboutPage />} />
          <Route path="/destination" element={<DestinationPage />} />
          <Route path="/itineary" element={<Navigate to="/destination" replace />} />
          <Route path="/itinerary" element={<Navigate to="/destination" replace />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-form"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-history"
            element={
              <ProtectedRoute>
                <BookingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction-history"
            element={
              <ProtectedRoute>
                <TransactionHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {showWidget && <ChatWidget />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}