import Navbar from "../Components/Navbar";
import AboutMe from "../Components/AboutMe";
import Services from "../Components/Services";
import AboutUsCTA from "../Components/AboutUSCTA";
import Reviews from "../Components/Reviews";
import Footer from "../Components/Footer";

const AboutPage = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="pt-16 sm:pt-[72px]">
      <AboutMe />
      <Services />
      <AboutUsCTA />
      <Reviews />
    </main>

    <Footer />
  </div>
);

export default AboutPage;