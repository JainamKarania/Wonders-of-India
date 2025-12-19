import Hero from "./Hero"
import Navbar from "./Navbar"
// import AboutMe from "./AboutMe"
// import Booking from "./Booking"
import Reviews from "./Reviews"
import Destination from "./Destination"
import ContactUs from "./ContactUs"
import Footer from "./Footer"
import PartnerSponsers from "./PartnersSponsers"
import Services from "./Services"
import CTA from "./CTA"
import { HomeHero } from "./HomeHero"
const HomeScreen = () => {
  return (
        <div>
        <Navbar />
        <Hero />
        <Destination />
        <Services />
        <Reviews />
        <PartnerSponsers />
        <CTA/>
        <Footer/>
        </div>
  )
}
export default HomeScreen
