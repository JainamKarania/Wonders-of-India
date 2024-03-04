import Hero from "./Hero"
import Navbar from "./Navbar"
import AboutMe from "./AboutMe"
import Booking from "./Booking"
import Reviews from "./Reviews"
import DestinationPackages from "./DestinationPackages"
import ContactUs from "./ContactUs"
import Footer from "./Footer"
const HomeScreen = () => {
  return (
        <div>
        <Navbar />
        <Hero />
        <AboutMe/>
        <DestinationPackages />
        <Reviews />
        <Booking />
        <ContactUs/>
        <Footer/>
        </div>
  )
}
export default HomeScreen
