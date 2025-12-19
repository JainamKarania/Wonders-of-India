import React from "react";
import Navbar from "../Components/Navbar";
import { Banner3 } from "../assets/index";
import Destination from "../Components/Destination";
import Reviews from "../Components/Reviews";
import Footer from "../Components/Footer";
// import ContactUs from "../Components/ContactUs";
import Services from "../Components/Services";
import AboutMe from "../Components/AboutMe";
import CTA from "../Components/CTA";
import AboutUsCTA from "../Components/AboutUSCTA";
const AboutPage = () => {
  return (
    <div>
      <Navbar />
      <AboutUsCTA/>
       <AboutMe/>
        <Services />
      
      <Reviews />
      {/* <ContactUs /> */}
      <Footer />
    </div>
  );
};

export default AboutPage;
