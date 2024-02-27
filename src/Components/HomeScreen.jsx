import Hero from "./Hero"
import Navbar from "./Navbar"
import AboutMe from "./AboutMe"
import Booking from "./Booking"
import DestinationPackages from "./DestinationPackages"
const HomeScreen = () => {
  return (
        <div>
        <Navbar />
        <Hero />
        <AboutMe/>
        <DestinationPackages />
        <Booking />
        </div>
  )
}
export default HomeScreen
