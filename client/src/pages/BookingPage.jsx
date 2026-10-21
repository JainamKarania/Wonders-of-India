import Navbar from "../layout/Navbar";
import BookingHero from "../features/booking/BookingHero";
import BookingsCTA from "../features/booking/BookingsCTA";
import Footer from "../layout/Footer";

const BookingPage = () => (
  <div id="booking" className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="pt-16 sm:pt-[72px]">
      <BookingHero />
      <BookingsCTA />
    </main>

    <Footer showCta={false} />
  </div>
);

export default BookingPage;