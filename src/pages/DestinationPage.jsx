import Navbar from "../Components/Navbar";
import Itineraries from "../Components/itinearies/Itineraries";
import DestinationCTA from "../Components/DestinationCTA";
import Reviews from "../Components/Reviews";
import Footer from "../Components/Footer";

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