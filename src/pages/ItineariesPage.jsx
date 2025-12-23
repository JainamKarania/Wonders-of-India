import Navbar from "../Components/Navbar";
import Itineraries from "../Components/itinearies/Itineraries";

const ItinerariesPage = () => {
  return (
    <div>
      <Navbar />     {/* ✅ Placed at page level */}
      <Itineraries />
    </div>
  );
};

export default ItinerariesPage;
