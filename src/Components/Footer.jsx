import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const QUICK_LINKS = [
  { name: "About us", path: "/aboutpage" },
  { name: "Destinations & Packages", path: "/destination" },
  { name: "Booking", path: "/booking" },
  { name: "Contact", path: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-14 sm:pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center text-center gap-4">
            <Link to="/" className="text-2xl font-bold">
              Wonders <span className="text-orange-400">of India</span>
            </Link>
            <p className="text-gray-300 max-w-xs">
              Curated Indian journeys, crafted with care — explore the country
              with us.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-colors hover:border-orange-400 hover:text-orange-400"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-bold mb-4 text-white">Quick Links</h2>
            <nav aria-label="Footer navigation" className="space-y-2">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block text-gray-300 hover:text-orange-400 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact information */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-lg font-bold mb-4 text-white">Contact Us</h2>
            <div className="flex flex-col gap-3 text-gray-300">
              <a
                href="mailto:hello@wondersofindia.travel"
                className="flex items-center justify-center gap-2 hover:text-orange-400 transition-colors"
              >
                <MdEmail size={18} className="shrink-0" />
                hello@wondersofindia.travel
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 hover:text-orange-400 transition-colors"
              >
                <MdPhone size={18} className="shrink-0" />
                +91 98765 43210
              </a>
              <p className="flex items-start justify-center gap-2 text-center">
                <MdLocationOn size={18} className="shrink-0 mt-0.5" />
                <span>45 MG Road, Bengaluru, Karnataka, India</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Wonders of India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;