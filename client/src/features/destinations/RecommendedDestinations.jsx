import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Sparkles, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const DEFAULT_TITLES = {
  similar: "You may also like",
  personalized: "Picked for you",
};

const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export default function RecommendedDestinations({
  destinationId,
  mode = "similar",
  title,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode === "similar" && !destinationId) {
      setItems([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const params = new URLSearchParams();
        if (destinationId) params.set("destinationId", destinationId);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/recommendations?${params.toString()}`,
          session?.access_token
            ? { headers: { Authorization: `Bearer ${session.access_token}` } }
            : undefined
        );

        if (cancelled) return;

        setItems(
          mode === "personalized"
            ? res.data.personalized ?? []
            : res.data.similar ?? []
        );
      } catch (err) {
        console.error(err);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [destinationId, mode]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="mt-8" aria-label={title ?? DEFAULT_TITLES[mode]}>
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-ink-900">
        <Sparkles size={18} aria-hidden="true" className="text-brand-600" />
        {title ?? DEFAULT_TITLES[mode]}
      </h3>

      {loading ? (
        <div className="flex gap-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-40 w-44 shrink-0" />
          ))}
        </div>
      ) : (
        <ul className="scrollbar-hide -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {items.map((d) => {
            const price = d.discountedPrice ?? d.price;

            return (
              <li key={d.id} className="w-44 shrink-0 snap-start">
                <Link
                  to={`/booking?destinationId=${d.id}`}
                  className="card-hover group block overflow-hidden"
                >
                  <div className="relative h-24 bg-gradient-to-br from-brand-100 to-brand-200">
                    {d.image ? (
                      <img
                        src={d.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-brand-500">
                        <MapPin size={24} aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {d.title}
                    </p>
                    {price ? (
                      <p className="mt-0.5 text-xs font-medium text-brand-700">
                        {formatPrice(price)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}