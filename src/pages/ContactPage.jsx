import React from 'react'
import Navbar from '../Components/Navbar'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import { ContactBanner } from '../assets/index'
const ContactPage = () => {
  return (
    <div id='contact'>
      <Navbar/>
      <div style={{backgroundImage : `url(${ContactBanner})`,height:"100vh",backgroundPosition:"center center",objectFit:'cover'}} className="py-20 relative bg-gray-900 bg-opacity-60 bg-cover">
      <div className="absolute inset-0 bg-neutral-950 w-full h-full bg-opacity-50"></div>
      <div className="relative flex top-1/4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Contact Us for Best Packages</h1>
          <p className="text-lg text-white mb-8">Explore India with us. Find your perfect destination.</p>
          </div>
        </div>
      </div>
    </div>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default ContactPage