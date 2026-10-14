import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Itineraries from "../Components/itinearies/Itineraries";

const ItinerariesPage = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="pt-16 sm:pt-[72px]">
      <Itineraries />
    </main>

    <Footer />
  </div>
);

export default ItinerariesPage;