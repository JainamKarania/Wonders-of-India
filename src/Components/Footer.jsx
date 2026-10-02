import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";


const QUICK_LINKS = [
  { label: "About us", to: "/aboutpage" },
  { label: "Destinations & Packages", to: "/destination" },
  { label: "Booking", to: "/booking" },
  { label: "Contact", to: "/contact" },
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
  "transition-colors duration-200 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

export default function Footer() {
  const visibleSocialLinks = SOCIAL_LINKS.filter(({ href }) => href.trim());

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3 lg:gap-12">
          {/* Brand */}
          <section className="flex min-w-0 flex-col items-center text-center sm:col-span-2 lg:col-span-1 lg:items-start lg:text-left">
            <Link
              to="/"
              aria-label="Wonders of India home"
              className="text-2xl font-bold tracking-tight"
            >
              Wonders <span className="text-orange-400">of India</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Curated Indian journeys, crafted with care — explore the country
              with us.
            </p>

            {visibleSocialLinks.length > 0 && (
              <nav
                aria-label="Social media"
                className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              >
                {visibleSocialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit us on ${label}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-300 hover:border-orange-400 hover:text-orange-400 ${linkClass}`}
                  >
                    <Icon aria-hidden="true" size={17} />
                  </a>
                ))}
              </nav>
            )}
          </section>

          
          <section className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="text-base font-semibold">Quick Links</h2>
            <nav aria-label="Footer navigation" className="mt-4">
              <ul className="flex flex-col items-center gap-3 sm:items-start">
                {QUICK_LINKS.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className={`text-sm text-slate-300 ${linkClass}`}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

         
          <section className="flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="text-base font-semibold">Contact Us</h2>
            <address className="mt-4 flex max-w-full flex-col gap-4 not-italic text-sm text-slate-300">
              <a
                href={`mailto:${CONTACT.email}`}
                className={`flex max-w-full items-start justify-center gap-3 break-all sm:justify-start ${linkClass}`}
              >
                <MdEmail aria-hidden="true" size={19} className="mt-0.5 shrink-0" />
                <span>{CONTACT.email}</span>
              </a>

              <a
                href={`tel:${CONTACT.phoneHref}`}
                className={`flex items-start justify-center gap-3 sm:justify-start ${linkClass}`}
              >
                <MdPhone aria-hidden="true" size={19} className="mt-0.5 shrink-0" />
                <span>{CONTACT.phoneDisplay}</span>
              </a>

              <p className="flex items-start justify-center gap-3 sm:justify-start">
                <MdLocationOn aria-hidden="true" size={19} className="mt-0.5 shrink-0" />
                <span>{CONTACT.address}</span>
              </p>
            </address>
          </section>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-5 text-slate-400 sm:mt-12 sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} Wonders of India. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
