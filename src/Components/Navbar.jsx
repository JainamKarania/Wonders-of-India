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
    <header className="fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-black/40">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          Wonders of India
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-6 text-white text-lg">
          <li><Link to="/aboutpage" className="hover:text-orange-400">About</Link></li>
          <li><Link to="/booking" className="hover:text-orange-400">Bookings</Link></li>
          <li><Link to="/destination" className="hover:text-orange-400">Packages</Link></li>
          <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
        </ul>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center">
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="bg-white text-black px-5 py-1.5 rounded-lg font-medium hover:bg-orange-400 transition"
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
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button onClick={() => setNavOpen(!isNavOpen)} className="lg:hidden">
          {isNavOpen ? (
            <IoCloseOutline size={28} className="text-white" />
          ) : (
            <HiMenuAlt3 size={28} className="text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-3/5 bg-black p-6 transition-transform duration-500 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="mt-20 flex flex-col gap-6 text-white text-lg">
          <li><Link to="/aboutpage" onClick={() => setNavOpen(false)}>About</Link></li>
          <li><Link to="/booking" onClick={() => setNavOpen(false)}>Bookings</Link></li>
          <li><Link to="/destination" onClick={() => setNavOpen(false)}>Packages</Link></li>
          <li><Link to="/contact" onClick={() => setNavOpen(false)}>Contact</Link></li>

          {!isAuthenticated ? (
            <Link
              to="/auth"
              onClick={() => setNavOpen(false)}
              className="bg-white text-black px-4 py-2 rounded-lg text-center"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg"
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
