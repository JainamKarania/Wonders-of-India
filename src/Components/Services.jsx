import { useEffect, useState } from "react";
import axios from "axios";
import { Plane, Hotel, Palmtree, Headset } from "lucide-react";

const ICON_MAP = {
  flight: Plane,
  hotel: Hotel,
  package: Palmtree,
  support: Headset,
};

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5"
    />
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/services`
        );

        if (!cancelled) setServices(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn't load our services right now.");
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
    <section
      aria-labelledby="services-heading"
      className="section relative overflow-hidden bg-ink-900"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />

      <div className="container-page relative">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-brand-400">What we do</p>
          <h2
            id="services-heading"
            className="section-title mt-3 !text-white"
          >
            Everything for a smooth journey
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-300 sm:text-lg">
            Complete travel solutions to make every trip comfortable, simple and
            memorable.
          </p>
        </header>

        <div className="mt-12 sm:mt-14">
          {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <p role="alert" className="text-center text-sm text-ink-300">
              {error}
            </p>
          )}

          {!loading && !error && services.length > 0 && (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ id, title, desc, icon }) => {
                const Icon = ICON_MAP[icon] ?? Plane;

                return (
                  <li
                    key={id ?? title}
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:bg-white/[0.07] sm:p-7"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow transition-transform duration-300 group-hover:scale-105"
                    >
                      <Icon size={26} />
                    </span>

                    <h3 className="mt-5 text-lg font-bold !text-white">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">
                      {desc}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}