import React, { useState } from 'react';
import { Banner2 } from '../assets/index';
import "../App.css"
const Booking = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    destinationPackage: '',
    tourPackageType: '',
    days: '',
    persons: '',
    children: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="py-20 relative bg-gray-900 bg-opacity-40 bg-banner bg-cover">
      <div className="absolute inset-0 bg-neutral-950 bg-opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center">
          <div className="p-6 rounded-lg md:w-2/3 sm:w-full">
          <h2 className="text-4xl font-bold text-center mb-8 text-white">Book your Package</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-white font-semibold mb-2">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="destinationPackage" className="block text-white font-semibold mb-2">Destination Package</label>
                <select id="destinationPackage" name="destinationPackage" value={formData.destinationPackage} onChange={handleChange} className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
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
              
              <div className="mb-4">
                <label htmlFor="persons" className="block text-white font-semibold mb-2">Persons</label>
                <input type="text" id="persons" name="persons" value={formData.persons} onChange={handleChange} className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="children" className="block text-white font-semibold mb-2">Children</label>
                <input type="text" id="children" name="children" value={formData.children} onChange={handleChange} className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-semibold mb-2">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
