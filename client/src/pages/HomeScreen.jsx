import Navbar from "../layout/Navbar";
import Hero from "../features/home/Hero";
import Destination from "../features/home/Destination";
import Services from "../components/sections/Services";
import Reviews from "../components/sections/Reviews";
import PartnerSponsers from "../components/sections/PartnersSponsors";
import CTA from "../components/sections/CTA";
import Footer from "../layout/Footer";

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

    <Footer showCta={false} />
  </div>
);

export default HomeScreen;