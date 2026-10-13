import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Compass, Plane } from "lucide-react";

export default function CTA() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stats`
        );
        if (!cancelled) setStats(res.data.data ?? []);
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

  return (
    <section aria-labelledby="cta-heading" className="section bg-ink-50">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-amber-400 px-6 py-12 shadow-lift sm:px-12 sm:py-16 lg:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-brand-800/30 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div>
              <h2
                id="cta-heading"
                className="text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-5xl"
              >
                Discover the magic of India
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                From the Himalayas to the backwaters of Kerala, explore curated
                journeys for culture lovers, adventurers and soul seekers. Your
                unforgettable trip starts here.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/destination" className="btn-dark">
                  <Compass size={18} aria-hidden="true" />
                  Explore packages
                </Link>
                <Link
                  to="/booking"
                  className="btn border border-white/60 text-white hover:bg-white/10"
                >
                  <Plane size={18} aria-hidden="true" />
                  Plan my trip
                </Link>
              </div>
            </div>

            {loading && (
              <div aria-hidden="true" className="grid grid-cols-3 gap-3 sm:gap-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/30" />
                ))}
              </div>
            )}

            {!loading && stats.length > 0 && (
              <dl className="grid grid-cols-3 gap-3 sm:gap-5">
                {stats.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/95 p-4 text-center shadow-soft sm:p-6"
                  >
                    <dd className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
                      {value}
                    </dd>
                    <dt className="mt-1 text-xs font-medium text-ink-600 sm:text-sm">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}