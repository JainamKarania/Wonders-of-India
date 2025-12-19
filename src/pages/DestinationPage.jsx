import React from 'react'
import Destination from '../Components/Destination'
import Navbar from '../Components/Navbar'
import Reviews from '../Components/Reviews'
import DestinationCTA from '../Components/DestinationCTA'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import { Banner4 } from '../assets/index'
const DestinationPage = () => {
  return (
    <div>
        <Navbar/>
        <DestinationCTA/>
        <Destination/>
        <Reviews/>
        {/* <ContactUs/> */}
        <Footer/>
    </div>
  )
}

export default DestinationPage