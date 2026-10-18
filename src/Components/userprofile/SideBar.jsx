import { NavLink } from "react-router-dom";
import { CalendarCheck, History, Receipt } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/profile", label: "My Bookings", icon: CalendarCheck },
  { to: "/booking-history", label: "Booking History", icon: History },
  { to: "/transaction-history", label: "Transactions", icon: Receipt },
];

const linkClass = ({ isActive }) =>
  `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-brand-600 text-white shadow-soft"
      : "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
  }`;

export default function SideBar() {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside
      aria-label="Account"
      className="card p-4 lg:sticky lg:top-24 lg:p-6"
    >
      <div className="flex items-center gap-3 lg:flex-col lg:gap-0 lg:text-center">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 lg:h-20 lg:w-20 lg:text-3xl"
        >
          {initial}
        </span>
        <div className="min-w-0 lg:mt-4">
          <p className="truncate font-display text-base font-bold capitalize text-ink-900 lg:text-lg">
            {displayName}
          </p>
          {user?.email ? (
            <p className="truncate text-sm text-ink-600">{user.email}</p>
          ) : null}
        </div>
      </div>

      <nav
        aria-label="Account pages"
        className="scrollbar-hide -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-6 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={linkClass}>
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}