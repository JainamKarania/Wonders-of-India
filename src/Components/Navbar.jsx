import {useState} from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
const Navbar = () => {
  const [isNav, setNav] = useState(true);

  const handleNav = () => {
    setNav(!isNav);
  };
  return (
    <nav className="bg-transparent fixed top-0 left-0 right-0 z-10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
        <div className="flex items-center justify-center">
        <a href="/" className="text-white text-2xl font-bold">Wonders of India</a>
        </div>
        <div className="flex items-center justify-center pt-2">
        <ul className="hidden ml-8 gap-2 space-x-4 lg:flex " >
              <li><a href="#about" className="text-white text-lg hover:text-gray-300">About Us</a></li>
              <li><a href="#bookings" className="text-white text-lg   hover:text-gray-300">Bookings</a></li>
              <li><a href="#destination" className="text-white text-lg  hover:text-gray-300">Destination Packages</a></li>
              <li><a href="#deals" className="text-white text-lg  hover:text-gray-300">Special Deals</a></li>
              <li><a href="#contact" className="text-white text-lg  hover:text-gray-300">Contact</a></li>
            </ul>
        </div>
        <div className="ml-8 hidden lg:flex pt-2 gap-4 items-center">
        <button className="bg-white text-gray-800 py-2 px-4 rounded-full  hover:bg-gray-200">Sign In</button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">Register</button>
          </div>
          <div onClick={handleNav} className="block md:hidden">
        {!isNav ? (
          <IoCloseOutline color="white" size={25} />
        ) : (
          <HiMenuAlt3 color="white" size={25} />
        )}
      </div>
      <div
        className={
          !isNav
            ? "fixed left-0 top-0 w-3/5 h-full px-4 ease-in-out duration-500 bg-black "
            : "fixed left-[-100%]"
        }
      >
        <div className='flex flex-col'>
        <ul className="pt-20 flex flex-col gap-4 mb-8">
        <li><a href="#about" className="p-4 text-white text-base hover:text-gray-300">About Us</a></li>
              <li><a href="#bookings" className="p-4 text-white text-base   hover:text-gray-300">Bookings</a></li>
              <li><a href="#destination" className="p-4 text-white text-base  hover:text-gray-300">Destination Packages</a></li>
              <li><a href="#deals" className="p-4 text-white text-base  hover:text-gray-300">Special Deals</a></li>
              <li><a href="#contact" className="p-4 text-white text-base  hover:text-gray-300">Contact</a></li>
        </ul>
        </div>
        <div className="flex flex-col items-start gap-4 p-2">
        <button className="bg-white text-gray-800 py-2 px-4 rounded-full  hover:bg-gray-200">Sign In</button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600">Register</button>
        </div>
       </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
