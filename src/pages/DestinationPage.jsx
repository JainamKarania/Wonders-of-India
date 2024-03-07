import React from 'react'
import Destination from '../Components/Destination'
import Navbar from '../Components/Navbar'
import Reviews from '../Components/Reviews'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import { Banner4 } from '../assets/index'
const DestinationPage = () => {
  return (
    <div>
        <Navbar/>
        <div style={{backgroundImage : `url(${Banner4})`,width:"100%",height:"100vh"}} className="py-20 relative bg-gray-900 bg-opacity-60 bg-cover">
      <div className="absolute inset-0 bg-neutral-950 w-full h-full bg-opacity-50"></div>
      <div className="relative flex top-1/4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Explore Mesmerizing Destinations with Us</h1>
          <p className="text-lg text-white mb-8">Explore India with us. Find your perfect destination.</p>
          </div>
        </div>
      </div>
    </div>
        <Destination/>
        <Reviews/>
        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default DestinationPage