import React from 'react'
import Navbar from '../Components/Navbar'
import Booking from '../Components/Booking'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import BookingsCTA from '../Components/BookingsCTA'
import PartnersSponsors from '../Components/PartnersSponsers'

const BookingPage = () => {
  return (
    <div id='booking'>
        <Navbar/>
        <BookingsCTA/>
        <PartnersSponsors/>
        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default BookingPage