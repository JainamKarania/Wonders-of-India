import React from 'react';
import { Link } from 'react-scroll'; // Assuming you are using React Router for navigation
import { Logo } from '../assets/index';
const Footer = () => {
  return (
    <footer className="text-white pt-16 pb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Website name with logo */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col gap-4">
            <a href="/" className="text-white text-2xl font-bold">Wonders of India</a>
            </div>
            <p className="mt-4 text-gray-300">Explore the world with us!</p>
          </div>
          {/* Navigation links */}
          <div className="flex flex-col items-center col-span-1 md:col-span-1">
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-300 text-center hover:text-white transition duration-300 cursor-pointer">About us</Link>
              <Link to="/destinations" className="block text-gray-300 text-center hover:text-white transition duration-300 cursor-pointer">Destinations Packages</Link>
              <Link to="/about" className="block text-gray-300 text-center hover:text-white transition duration-300 cursor-pointer">Booking</Link>
              <Link to="/contact" className="block text-gray-300 text-center hover:text-white transition duration-300 cursor-pointer">Contact</Link>
            </nav>
          </div>
          {/* Contact information */}
          <div className="flex flex-col items-center col-span-1 md:col-span-1">
            <h2 className="text-lg font-bold mb-4">Contact Us</h2>
            <p className="text-gray-300">Email: info@example.com</p>
            <p className="text-gray-300">Phone: +1234567890</p>
            <p className="text-gray-300">Address: 123 Main Street, City, Country</p>
          </div>
        </div>
      </div>
      {/* Copyright section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-center text-gray-300">
        <p>&copy; {new Date().getFullYear()} Travel Agency. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
