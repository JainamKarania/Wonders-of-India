import React, { useRef ,useState } from 'react';
import { Banner2 } from '../assets/index';
import emailjs from '@emailjs/browser';
import "../App.css"
const Booking = () => {
  const [submitted, setSubmitted] = useState(false);
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_o1lvhpf', 'template_n3nxo8p', form.current, {
        publicKey: 'eRoY1OzyVF6A82LeH',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setSubmitted(true);
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div className="py-20 relative bg-gray-900 bg-opacity-40 bg-banner bg-cover">
      <div className="absolute inset-0 bg-neutral-950 bg-opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center">
          <div className="p-6 rounded-lg md:w-2/3 sm:w-full">
          {!submitted ? (
              <>
          <h2 className="text-4xl font-bold text-center mb-8 text-white">Book your Package</h2>
          <form onSubmit={sendEmail} ref={form}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-white font-semibold mb-2">Full Name</label>
                <input type="text" id="fullName" name="fullName" className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="destinationPackage" className="block text-white font-semibold mb-2">Destination Package</label>
                <select id="destinationPackage" name="destinationPackage" className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                  <option value="">Select Destination Package</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Ayodhya">Ayodhya</option>
                  <option value="Tirupati">Tirupati</option>
                  <option value="Kutch">Kutch</option>
                  <option value="Ahemdabad">Ahemdabad</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
              
              <div className="flex justify-center items-center gap-4 mb-4">
                <label htmlFor="adults" className="block text-white font-semibold mb-2">Adults</label>
                <input type="number" id="adults" name="adults" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
                <label htmlFor="children" className="block text-white font-semibold mb-2">Children</label>
                <input type="number" id="children" name="children" className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-semibold mb-2">Email Address</label>
                <input type="email" id="email" name="email" className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
            </form>
            </>
              ) : (
                <div className="text-left">
                  <h2 className="text-3xl font-bold mb-4 text-white">Thank you for reaching out!</h2>
                  <p className="text-lg text-white">We appreciate your message. Our team will get back to you as soon as possible.</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
