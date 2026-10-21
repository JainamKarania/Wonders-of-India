import { useEffect, useState } from "react";
import axios from "axios";
import { Plane, Hotel, Globe, Building2 } from "lucide-react";

const ICON_MAP = {
  flight: Plane,
  hotel: Hotel,
  public: Globe,
  business: Building2,
};

export default function PartnersSponsors() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/partners`
        );
        if (!cancelled) setPartners(res.data.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && partners.length === 0) return null;

  return (
    <section
      aria-labelledby="partners-heading"
      className="section bg-ink-50"
    >
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our network</p>
          <h2 id="partners-heading" className="section-title mt-3">
            Trusted partners
          </h2>
          <p className="section-subtitle mx-auto">
            We work with leading travel brands and local experts to deliver
            safe, seamless journeys across India.
          </p>
        </header>

        {loading ? (
          <div
            aria-hidden="true"
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-44" />
            ))}
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map(({ id, name, icon, desc }) => {
              const Icon = ICON_MAP[icon] ?? Building2;

              return (
                <li key={id ?? name} className="card-hover p-6 text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"
                  >
                    <Icon size={26} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink-900">{name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {desc}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}