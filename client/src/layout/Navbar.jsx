import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  Menu,
  X,
  ChevronDown,
  User,
  Ticket,
  Receipt,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../features/auth/AuthContext.jsx";

const NAV_LINKS = [
  { name: "Destinations", path: "/destination" },
  { name: "Bookings", path: "/booking" },
  { name: "About", path: "/aboutpage" },
  { name: "Contact", path: "/contact" },
];

const ACCOUNT_LINKS = [
  { name: "My Profile", path: "/profile", icon: User },
  { name: "My Bookings", path: "/booking-history", icon: Ticket },
  { name: "Transactions", path: "/transaction-history", icon: Receipt },
];

function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Wonders of India home"
      className="flex shrink-0 items-center gap-2.5 rounded-lg"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow">
        <Compass size={20} aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-ink-900 sm:text-xl">
        Wonders <span className="text-brand-600">of India</span>
      </span>
    </Link>
  );
}

const desktopLinkClass = ({ isActive }) =>
  `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
  }`;

const drawerLinkClass = ({ isActive }) =>
  `flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium transition-colors ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-ink-700 hover:bg-ink-100"
  }`;

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuRef = useRef(null);
  const drawerCloseRef = useRef(null);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Traveler";
  const firstName = displayName.split(" ")[0];
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerCloseRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    setDrawerOpen(false);
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur-lg transition-shadow duration-300 ${
        scrolled ? "border-ink-200 shadow-soft" : "border-ink-100"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="container-page flex h-16 items-center justify-between gap-4 sm:h-[72px]"
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ name, path }) => (
            <li key={path}>
              <NavLink to={path} className={desktopLinkClass}>
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/chat" className="btn-ghost !min-h-[40px] !px-3.5 !text-sm">
            <Sparkles size={16} className="text-brand-600" aria-hidden="true" />
            Ask AI
          </Link>

          {!isAuthenticated ? (
            <Link to="/auth" className="btn-primary !min-h-[40px] !text-sm">
              Login
            </Link>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Account menu"
                className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-3 transition hover:border-ink-300 hover:shadow-soft"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {initial}
                </span>
                <span className="max-w-[7rem] truncate text-sm font-medium text-ink-800">
                  {firstName}
                </span>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`text-ink-500 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="card absolute right-0 mt-2 w-64 animate-fade-in p-1.5 shadow-lift"
                >
                  <div className="border-b border-ink-100 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {displayName}
                    </p>
                    {user?.email && (
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                    )}
                  </div>

                  <div className="py-1.5">
                    {ACCOUNT_LINKS.map(({ name, path, icon: Icon }) => (
                      <Link
                        key={path}
                        to={path}
                        role="menuitem"
                        className="flex min-h-[40px] items-center gap-3 rounded-lg px-3 text-sm text-ink-700 transition hover:bg-ink-100"
                      >
                        <Icon size={16} aria-hidden="true" className="text-ink-500" />
                        {name}
                      </Link>
                    ))}
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex min-h-[40px] w-full items-center gap-3 rounded-lg border-t border-ink-100 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-800 transition hover:bg-ink-100 lg:hidden"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </nav>

      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-lift transition-[transform,visibility] duration-300 ease-out lg:hidden ${
          drawerOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-4">
          <Logo onClick={() => setDrawerOpen(false)} />
          <button
            ref={drawerCloseRef}
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-700 transition hover:bg-ink-100"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ name, path }) => (
              <li key={path}>
                <NavLink to={path} className={drawerLinkClass}>
                  {name}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/chat" className={drawerLinkClass}>
                <Sparkles
                  size={18}
                  aria-hidden="true"
                  className="mr-2 text-brand-600"
                />
                Ask AI
              </NavLink>
            </li>
          </ul>

          {isAuthenticated && (
            <>
              <p className="mb-2 mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-ink-400">
                Account
              </p>
              <ul className="flex flex-col gap-1">
                {ACCOUNT_LINKS.map(({ name, path, icon: Icon }) => (
                  <li key={path}>
                    <NavLink to={path} className={drawerLinkClass}>
                      <Icon
                        size={18}
                        aria-hidden="true"
                        className="mr-3 text-ink-500"
                      />
                      {name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="border-t border-ink-100 p-4">
          {!isAuthenticated ? (
            <Link to="/auth" className="btn-primary w-full">
              Login / Sign up
            </Link>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {displayName}
                  </p>
                  {user?.email && (
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-danger w-full"
              >
                <LogOut size={18} aria-hidden="true" />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>
    </header>
  );
}