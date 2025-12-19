import React from "react";
import { About } from "../assets/index";

const AboutMe = () => {
  return (
    <section className="py-20 bg-slate-950" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Text Section */}
          <article className="p-6 rounded-lg w-full shadow-md bg-transparent">
            <header>
              {/* <h2
                id="about-heading"
                className="text-4xl sm:text-5xl text-white font-bold mb-8 leading-tight"
              >
                About Us
              </h2> */}
            </header>

            <p className="text-base sm:text-lg text-white mb-6 leading-relaxed">
              At our travel agency, we are committed to providing exceptional
              travel experiences tailored to your preferences. From breathtaking
              beach destinations to thrilling adventure tours, we offer a wide
              range of options to suit every traveler.
            </p>

            <p className="text-base sm:text-lg text-white mb-6 leading-relaxed">
              Our easy-to-use website makes planning your dream vacation a
              breeze. Browse through our extensive collection of destinations,
              explore detailed information about each location, and book your
              trip with confidence. With secure payment options and dedicated
              customer support, we're here to ensure that your journey is smooth
              and enjoyable.
            </p>

            <p className="text-base sm:text-lg text-white mb-6 leading-relaxed">
              Our unique arrangements are crafted to turn your travel dreams into
              reality, offering unmatched value and unforgettable experiences —
              from discounted hotel stays and exclusive sightseeing tours to free
              upgrades and added benefits.
            </p>

            <p className="text-base sm:text-lg text-white leading-relaxed">
              Whether you're a solo explorer, a couple seeking a romantic escape,
              or a family planning a memorable vacation, <strong>"Wonders of India"</strong>{" "}
              has the perfect package for you. Allow us to guide you through the
              marvels of India.
            </p>
          </article>

          {/* Image Section */}
          <figure className="p-6 rounded-lg shadow-md w-full h-full">
            <img
              src={About}
              alt="Travel experience by Wonders of India"
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
