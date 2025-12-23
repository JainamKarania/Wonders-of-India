import React from 'react'
import Navbar from '../Components/Navbar'
import Booking from '../Components/Booking'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import BookingsCTA from '../Components/BookingsCTA'
import PartnersSponsors from '../Components/PartnersSponsers'
import BookingHero from '../booking/BookingHero'

const BookingPage = () => {
  return (
    <div id='booking'>
        <Navbar/>
        <BookingHero/>
        <PartnersSponsors/>
        <BookingsCTA/>
        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default BookingPage