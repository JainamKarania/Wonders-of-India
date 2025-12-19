import React from 'react'
import Navbar from '../Components/Navbar'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'
import { ContactBanner } from '../assets/index'
import ContactUsCTA from '../Components/ContactUsCTA'
const ContactPage = () => {
  return (
    <div id='contact'>
      <Navbar/>
      <ContactUs/>
      <ContactUsCTA/>
      <Footer/>
    </div>
  )
}

export default ContactPage