import Navbar from "../layout/Navbar";
import AboutMe from "../features/about/AboutMe";
import Services from "../components/sections/Services";
import AboutUsCTA from "../features/about/AboutUsCTA";
import Reviews from "../components/sections/Reviews";
import Footer from "../layout/Footer";

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