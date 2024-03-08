import React from 'react';
import Islands from '../assets/Islands.mp4'
const Hero = () => {

  return (
    <div className="relative bg-gray-900 overflow-hidden w-full h-screen">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-70">
        <source src={Islands} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative flex top-1/4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Welcome to our Wonders of India</h1>
          <p className="text-lg text-white mb-8">Explore India with us. Find your perfect destination.</p>
          <div className="flex sm:w-1/2 w-full">
            <input type="text" placeholder="Search destinations..." className="flex-grow py-3 px-4 mr-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white bg-opacity-75" />
            <button className="bg-blue-500 text-white py-3 px-6 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"><Link to ="/booking" />Search</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
