import React from 'react'
import Navbar from '../Components/Navbar'
import { Banner3 } from '../assets/index'
import Destination from '../Components/Destination'
import Reviews from '../Components/Reviews'
import Footer from '../Components/Footer'
import ContactUs from '../Components/ContactUs'
const AboutPage = () => {
  return (
    <div>
        <Navbar />
        <div className="relative overflow-hidden w-full h-screen">
        <div>
        <img src={Banner3} className='absolute inset-0 w-full h-full object-cover opacity-70' />
        </div>
      <div className="relative flex top-1/4 z-10">
        <div className="max-w-7xl ml-[12%] px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col">
          <h1 className="sm:text-6xl font-bold text-white mb-12">About Us</h1>
          <p className="text-lg text-white mb-6">
            At our travel agency, we are committed to providing exceptional travel experiences tailored to your preferences.
            From breathtaking beach destinations to thrilling adventure tours, we offer a wide range of options to suit every traveler.Our easy-to-use website makes planning your dream vacation a breeze. Browse through our extensive collection of destinations,
            explore detailed information about each location, and book your trip with confidence. With secure payment options and
            dedicated customer support, we're here to ensure that your journey is as smooth and enjoyable as possible.Our unique arrangements are created to make your movement dreams a reality, offering unparalleled worth and extraordinary encounters. From limited inn stays and select touring visits to free updates and added advantages, our arrangements guarantee that you capitalize on your movement spending plan.
          </p>
          </div>
        </div>
      </div>
    </div>
    <Destination />
    <Reviews/>
    <ContactUs/>
    <Footer/>
    </div>
  )
}

export default AboutPage