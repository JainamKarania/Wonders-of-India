import React from 'react';
import { About } from '../assets/index';
const AboutMe = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg shadow-md">
          <h2 className="text-5xl text-white font-bold mb-8">About Us</h2>
          <p className="text-lg text-white mb-6">
            At our travel agency, we are committed to providing exceptional travel experiences tailored to your preferences.
            From breathtaking beach destinations to thrilling adventure tours, we offer a wide range of options to suit every traveler.Our easy-to-use website makes planning your dream vacation a breeze. Browse through our extensive collection of destinations,
            explore detailed information about each location, and book your trip with confidence. With secure payment options and
            dedicated customer support, we're here to ensure that your journey is as smooth and enjoyable as possible.Our unique arrangements are created to make your movement dreams a reality, offering unparalleled worth and extraordinary encounters. From limited inn stays and select touring visits to free updates and added advantages, our arrangements guarantee that you capitalize on your movement spending plan.
          </p>
          <p className="text-lg text-white">Whether you're an independent explorer, a couple looking for a heartfelt escape, or a family searching for an extraordinary excursion, "Wonders of India" has the ideal bundle for you. Allow us to be your aide as you set out on an extraordinary excursion through the marvels of India.</p>
        </div>
        <div className="p-6 rounded-lg shadow-md">
          <img src={About} alt="Wonders of India" className="w-full h-full object-cover rounded-lg" />
        </div>
         </div>
      </div>
    </div>
  );
};

export default AboutMe;
