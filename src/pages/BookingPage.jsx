import Navbar from "../Components/Navbar";
import BookingHero from "../booking/BookingHero";
import BookingsCTA from "../Components/BookingsCTA";
import Footer from "../Components/Footer";

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