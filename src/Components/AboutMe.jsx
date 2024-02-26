import React from 'react';

const AboutMe = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet ultrices ex, sed eleifend libero volutpat eget.
            Mauris vitae lectus vel magna malesuada sollicitudin vel eget tortor. Sed nec felis sem. Nullam a sem sit amet lacus rhoncus gravida.
          </p>
          <p className="text-lg mb-6">
            Vestibulum faucibus odio in leo viverra, sed congue enim vehicula. Quisque eu odio eleifend, interdum nisi vel, pharetra eros.
            Phasellus rhoncus, nunc ut sagittis malesuada, velit ipsum posuere libero, vitae hendrerit nunc leo eget justo.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <ul className="list-disc text-lg">
            <li className="mb-2">Easy-to-use search functionality to find destinations</li>
            <li className="mb-2">Detailed destination information including attractions and activities</li>
            <li className="mb-2">Customizable travel packages tailored to individual preferences</li>
            <li className="mb-2">Secure payment options for hassle-free booking</li>
            <li className="mb-2">24/7 customer support for assistance and queries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
