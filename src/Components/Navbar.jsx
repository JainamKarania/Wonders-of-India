import {useState} from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isNav, setNav] = useState(true);

  const handleNav = () => {
    setNav(!isNav);
  };
  return (
    <nav className="bg-transparent fixed top-0 left-0 right-0 z-20 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
        <div className="flex items-center justify-center">
        <a href="/" className="text-white text-2xl font-bold">Wonders of India</a>
        </div>
        <div className="flex items-center justify-center pt-2">
        <ul className="hidden ml-8 gap-2 space-x-4 lg:flex " >
              <li><Link to="/aboutpage" className="text-white text-lg hover:text-gray-300">About Us</Link></li>
              <li><Link to="/booking" className="text-white text-lg   hover:text-gray-300">Bookings</Link></li>
              <li><Link to="/destination" className="text-white text-lg  hover:text-gray-300">Destination Packages</Link></li>
              <li><Link to="/contact" className="text-white text-lg  hover:text-gray-300">Contact</Link></li>
            </ul>
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
        <li><Link to="/aboutpage" className="text-white text-lg hover:text-gray-300">About Us</Link></li>
              <li><Link to="/booking" className="text-white text-lg   hover:text-gray-300">Bookings</Link></li>
              <li><Link to="/destination" className="text-white text-lg  hover:text-gray-300">Destination Packages</Link></li>
              <li><Link to="/contact" className="text-white text-lg  hover:text-gray-300">Contact</Link></li>
        </ul>
        </div>
       </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
