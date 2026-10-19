import Navbar from "../Components/Navbar";
import ContactUs from "../Components/ContactUs";
import ContactUsCTA from "../Components/ContactUsCTA";
import Footer from "../Components/Footer";

const ContactPage = () => (
  <div id="contact" className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="pt-16 sm:pt-[72px]">
      <ContactUs />
      <ContactUsCTA />
    </main>

    <Footer showCta={false} />
  </div>
);

export default ContactPage;