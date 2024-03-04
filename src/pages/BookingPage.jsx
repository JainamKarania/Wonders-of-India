import React from 'react'
import Navbar from '../Components/Navbar'
import Booking from '../Components/Booking'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'

const BookingPage = () => {
  return (
    <div id='booking'>
        <Navbar/>
        <Booking/>
        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default BookingPage