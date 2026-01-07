import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useAuth } from "./context/AuthContext.jsx";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 text-white lg:bg-black/50 lg:backdrop-blur-lg border-b border-white/10">
      <nav
        className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide"
        >
          Wonders <span className="text-orange-400">of India</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8 text-white font-medium">
          {[
            { name: "About", path: "/aboutpage" },
            { name: "Packages & Itinearies", path: "/destination" },
            { name: "Bookings", path: "/booking" },
            { name: "Contact", path: "/contact" },
            // { name: "Itineraries", path: "/itineary" }
          ].map((item) => (
            <li key={item.name}>
              <Link to={item.path} className="relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-400 transition-all group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Section (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </Link>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen}>
                <AccountCircle className="text-white" fontSize="large" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {!isNavOpen && (
          <button
            className="lg:hidden text-white"
            aria-label="Open Navigation Menu"
            onClick={() => setNavOpen(true)}
          >
            <HiMenuAlt3 size={30} />
          </button>
        )}
      </nav>

      {/* Mobile Navigation Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-black text-white p-6 transform transition-transform duration-500 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="flex justify-between items-center mb-12">
          <Link
            to="/"
            onClick={() => setNavOpen(false)}
            className="text-2xl font-bold"
          >
            Wonders <span className="text-orange-400">of India</span>
          </Link>
          <IoCloseOutline
            size={30}
            className="cursor-pointer"
            onClick={() => setNavOpen(false)}
          />
        </div>

        <ul className="flex flex-col gap-6 text-lg">
          <li>
            <Link to="/aboutpage" onClick={() => setNavOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/destination" onClick={() => setNavOpen(false)}>
              Packages
            </Link>
          </li>
          <li>
            <Link to="/booking" onClick={() => setNavOpen(false)}>
              Bookings
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setNavOpen(false)}>
              Contact
            </Link>
          </li>

          {!isAuthenticated ? (
            <Link
              to="/auth"
              onClick={() => setNavOpen(false)}
              className="mt-6 bg-white text-black py-2 rounded-lg text-center font-semibold"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-500 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          )}
        </ul>
      </aside>
    </header>
  );
};

export default Navbar;
