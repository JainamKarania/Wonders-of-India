import { Link } from "react-router-dom";
import { Compass, Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const EXPLORE_LINKS = [
  { label: "Destinations", to: "/destination" },
  { label: "Itineraries", to: "/itineary" },
  { label: "Book a trip", to: "/booking" },
  { label: "Plan with AI", to: "/chat" },
];

const COMPANY_LINKS = [
  { label: "About us", to: "/aboutpage" },
  { label: "Contact", to: "/contact" },
  { label: "My bookings", to: "/booking-history" },
  { label: "My profile", to: "/profile" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "", icon: FaFacebookF },
  { label: "Instagram", href: "", icon: FaInstagram },
  { label: "X", href: "", icon: FaXTwitter },
  { label: "YouTube", href: "", icon: FaYoutube },
];

const CONTACT = {
  email: "hello@wondersofindia.travel",
  phoneDisplay: "+91 98765 43210",
  phoneHref: "+919876543210",
  address: "45 MG Road, Bengaluru, Karnataka, India",
};

const linkClass =
  "text-sm text-ink-300 transition-colors duration-200 hover:text-brand-400 focus-visible:ring-offset-ink-900";

function LinkColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const socials = SOCIAL_LINKS.filter(({ href }) => href.trim());

  return (
    <footer className="bg-ink-900 text-white">
      <div className="container-page pt-12 sm:pt-16">
        <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
              Not sure where to go next?
            </h2>
            <p className="mt-1.5 text-sm text-white/90 sm:text-base">
              Tell our AI assistant what you love and get a trip idea in seconds.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/chat" className="btn bg-white text-brand-700 hover:bg-brand-50">
              <Sparkles size={18} aria-hidden="true" />
              Plan with AI
            </Link>
            <Link
              to="/contact"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              Talk to a human
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8">
          <section className="col-span-2 lg:col-span-4">
            <Link
              to="/"
              aria-label="Wonders of India home"
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Compass size={20} aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Wonders <span className="text-brand-400">of India</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-300">
              Curated Indian journeys, crafted with care. Explore the country
              with people who know it best.
            </p>

            {socials.length > 0 && (
              <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit us on ${label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ink-300 transition hover:border-brand-400 hover:text-brand-400"
                    >
                      <Icon aria-hidden="true" size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="lg:col-span-2 lg:col-start-6">
            <LinkColumn title="Explore" links={EXPLORE_LINKS} />
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Company" links={COMPANY_LINKS} />
          </div>

          <section className="col-span-2 min-w-0 lg:col-span-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h2>
            <address className="mt-4 space-y-4 not-italic">
              <a
                href={`mailto:${CONTACT.email}`}
                className={`flex items-start gap-3 break-all ${linkClass}`}
              >
                <Mail size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-400" />
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className={`flex items-start gap-3 ${linkClass}`}
              >
                <Phone size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-400" />
                {CONTACT.phoneDisplay}
              </a>
              <p className="flex items-start gap-3 text-sm text-ink-300">
                <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-400" />
                {CONTACT.address}
              </p>
            </address>
          </section>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-ink-400 sm:text-sm">
          &copy; {new Date().getFullYear()} Wonders of India. All rights reserved.
        </div>
      </div>
    </footer>
  );
}