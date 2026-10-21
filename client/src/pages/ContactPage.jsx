import Navbar from "../layout/Navbar";
import ContactUs from "../features/contact/ContactUs";
import ContactUsCTA from "../features/contact/ContactUsCTA";
import Footer from "../layout/Footer";

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