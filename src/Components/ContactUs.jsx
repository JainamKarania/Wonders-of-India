import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission (you can replace it with actual submission logic)
    console.log(formData);
    // Clear the form fields after submission
    setFormData({ name: '', email: '', message: '' });
    // Set submitted to true to show the success message
    setSubmitted(true);
  };

  return (
    <div className="py-20 border-b border-b-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg shadow-md">
            {!submitted ? (
              <>
                <h2 className="text-4xl font-bold mb-6 text-white">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-semibold mb-2">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-white font-semibold mb-2">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-white font-semibold mb-2">Your Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required></textarea>
                  </div>
                  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">Thank you for reaching out!</h2>
                <p className="text-lg text-white">We appreciate your message. Our team will get back to you as soon as possible.</p>
              </div>
            )}
          </div>
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-4xl font-bold mb-12 text-white">Reach Out to Us</h2>
            <p className="text-2xl text-white mb-4">For any inquiries or assistance, feel free to reach out to us:</p>
            <p className="text-2xl text-white">Email: example@example.com</p>
            <p className="text-2xl text-white">Phone: +1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
