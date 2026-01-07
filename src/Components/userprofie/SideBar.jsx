import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NavLink } from "react-router-dom";
import {
  History,
  SupportAgent,
  ExpandMore,
  ReceiptLong,
  Menu,
  Close,
} from "@mui/icons-material";
import { MdDashboard } from "react-icons/md";

const SideBar = () => {
  const sidebarRef = useRef(null);
  const [openSupport, setOpenSupport] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${isActive ? "bg-white/30 font-semibold" : "hover:bg-white/20"}`;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-orange-600 text-white p-2 rounded-lg shadow-lg"
        aria-label="Open Sidebar"
      >
        <Menu />
      </button>

      {/* Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:static top-0 left-0 z-30
          h-full md:h-auto
          max-w-md w-full bg-gradient-to-b from-orange-600 to-orange-500
          text-white rounded-none md:rounded-2xl
          p-6 shadow-xl
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        aria-label="User Sidebar"
      >
        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 z-[70]"
          aria-label="Close Sidebar"
        >
          <Close />
        </button>

        {/* Profile Info */}
        <header className="flex flex-col items-center text-center mb-8 mt-6 md:mt-0">
          <img
            src="https://i.pravatar.cc/150?img=32"
            alt="User profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <h2 className="mt-4 text-xl font-semibold">Jainam Karania</h2>
          <p className="text-sm opacity-90">
            jainam@wondersofindia.com
          </p>
        </header>

        {/* Navigation */}
        <nav className="space-y-4" role="navigation">
          <NavLink
            to="/profile"
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <MdDashboard />
            My Bookings
          </NavLink>
          <NavLink
            to="/booking-history"
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <History />
            Booking History
          </NavLink>

          {/* Support Dropdown */}
          <div>
            <button
              onClick={() => setOpenSupport(!openSupport)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/20 transition"
              aria-expanded={openSupport}
            >
              <span className="flex items-center gap-3">
                <SupportAgent />
                Support
              </span>
              <ExpandMore
                className={`transition-transform ${
                  openSupport ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSupport && (
              <div className="ml-10 mt-2 space-y-2 text-sm">
                <NavLink
                  to="/transaction-history"
                  className={({ isActive }) =>
                    `flex items-center gap-2 transition
                     ${isActive ? "underline font-medium" : "hover:underline"}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <ReceiptLong fontSize="small" />
                  Transaction Details
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
