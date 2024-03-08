import React, { useRef ,useState } from 'react';
import emailjs from '@emailjs/browser';
const ContactUs = () => {
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
    <div className="py-20 border-b border-b-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg shadow-md">
          {!submitted ? (
              <>
                <h2 className="text-4xl font-bold mb-6 text-white">Contact Us</h2>
                <form onSubmit={sendEmail} ref={form} id='contactForm'>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-white font-semibold mb-2">Name</label>
                    <input type="text" id="name" name="user_name" autoComplete='off' className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-white font-semibold mb-2">Email Address</label>
                    <input type="email" id="email" name="user_email" autoComplete='off'  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-white font-semibold mb-2">Your Message</label>
                    <textarea id="message" name="message" autoComplete='off'  rows="4" className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required></textarea>
                  </div>
                  <button type="submit"  value="Send" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
                </form>
              </>
              ) : (
                <div className="text-left">
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
