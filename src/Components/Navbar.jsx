import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useAuth } from "./context/AuthContext.jsx";

// Single source of truth for nav links — used by both the desktop bar and
// the mobile drawer so labels/paths can never drift out of sync.
const NAV_LINKS = [
  { name: "About", path: "/aboutpage" },
  { name: "Packages & Itineraries", path: "/destination" },
  { name: "Bookings", path: "/booking" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  const closeNav = () => setNavOpen(false);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Lock body scroll while the mobile drawer is open, and let Escape close it.
  useEffect(() => {
    if (!isNavOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeNav();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNavOpen]);

  const navLinkClass = ({ isActive }) =>
    `relative group ${isActive ? "text-orange-400" : "text-white"}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/50 text-white md:backdrop-blur-lg border-b border-white/10">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold text-white tracking-wide shrink-0"
        >
          Wonders <span className="text-orange-400">of India</span>
        </Link>

        {/* Desktop Navigation (tablet + up) */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-white font-medium">
          {NAV_LINKS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={navLinkClass}>
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-400 transition-all group-hover:w-full"></span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Section (tablet + up) */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-orange-400 to-yellow-400 text-black px-4 lg:px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Login
            </Link>
          ) : (
            <>
              <IconButton onClick={handleMenuOpen} aria-label="Account menu">
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

        {/* Mobile Menu Toggle (below tablet) */}
        <button
          className="md:hidden text-white p-1"
          aria-label={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          aria-expanded={isNavOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setNavOpen((open) => !open)}
        >
          {isNavOpen ? (
            <IoCloseOutline size={28} />
          ) : (
            <HiMenuAlt3 size={28} />
          )}
        </button>
      </nav>

      {/* Backdrop — click outside the drawer to close it */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 transition-opacity duration-300 ${
          isNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeNav}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <aside
        id="mobile-nav-drawer"
        ref={drawerRef}
        className={`md:hidden fixed top-0 left-0 h-full w-4/5 max-w-xs bg-black text-white p-6 transform transition-transform duration-300 ease-out ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
        aria-hidden={!isNavOpen}
      >
        <div className="flex justify-between items-center mb-10">
          <Link to="/" onClick={closeNav} className="text-xl font-bold">
            Wonders <span className="text-orange-400">of India</span>
          </Link>
          <IoCloseOutline
            size={28}
            className="cursor-pointer"
            onClick={closeNav}
            aria-label="Close menu"
          />
        </div>

        <ul className="flex flex-col gap-6 text-lg">
          {NAV_LINKS.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} onClick={closeNav} className={navLinkClass}>
                {item.name}
              </NavLink>
            </li>
          ))}

          {!isAuthenticated ? (
            <Link
              to="/auth"
              onClick={closeNav}
              className="mt-4 bg-white text-black py-2 rounded-lg text-center font-semibold"
            >
              Login
            </Link>
          ) : (
            <>
              <NavLink to="/profile" onClick={closeNav} className={navLinkClass}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-2 bg-red-500 py-2 rounded-lg font-semibold text-left px-3"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </aside>
    </header>
  );
};

export default Navbar;