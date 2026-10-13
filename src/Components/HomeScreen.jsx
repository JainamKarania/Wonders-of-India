import Navbar from "./Navbar";
import Hero from "./Hero";
import Destination from "./Destination";
import Services from "./Services";
import Reviews from "./Reviews";
import PartnerSponsers from "./PartnersSponsers";
import CTA from "./CTA";
import Footer from "./Footer";

const HomeScreen = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main>
      <Hero />
      <Destination />
      <Services />
      <Reviews />
      <PartnerSponsers />
      <CTA />
    </main>

    <Footer />
  </div>
);

export default HomeScreen;