import Hero from "./Hero"
import Navbar from "./Navbar"
import AboutMe from "./AboutMe"
import Booking from "./Booking"
import Reviews from "./Reviews"
import Destination from "./Destination"
import ContactUs from "./ContactUs"
import Footer from "./Footer"
const HomeScreen = () => {
  return (
        <div>
        <Navbar />
        <Hero />
        <AboutMe/>
        <Destination />
        <Reviews />
        <Booking />
        <ContactUs/>
        <Footer/>
        </div>
  )
}
export default HomeScreen
