import Navbar from "../layout/Navbar";
import Itineraries from "../features/destinations/Itineraries";
import DestinationCTA from "../features/destinations/DestinationCTA";
import Reviews from "../components/sections/Reviews";
import Footer from "../layout/Footer";

const DestinationPage = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="pt-16 sm:pt-[72px]">
      <Itineraries />
      <DestinationCTA />
      <Reviews />
    </main>

    <Footer />
  </div>
);

export default DestinationPage;