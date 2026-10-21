import Navbar from "../layout/Navbar";
import SideBar from "../features/account/SideBar";
import BookingHistory from "../features/account/BookingHistory";
import Footer from "../layout/Footer";

const BookingHistoryPage = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="container-page pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <SideBar />

        <div className="min-w-0 space-y-8">
          <header>
            <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
              Booking history
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              Review all your trips with Wonders of India and download invoices.
            </p>
          </header>

          <BookingHistory />
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default BookingHistoryPage;