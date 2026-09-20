import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@mui/material";
import { supabase } from "../lib/supabaseClient";

const RecommendedDestinations = ({ destinationId, mode = "similar", title }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode === "similar" && !destinationId) {
      setLoading(false);
      setItems([]);
      return;
    }

    const fetchRecommendations = async () => {
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

        setItems(
          mode === "personalized"
            ? res.data.personalized ?? []
            : res.data.similar ?? []
        );
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [destinationId, mode]);

  if (!loading && items.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-slate-800 mb-3">{title}</h3>

      {loading ? (
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={150}
              height={110}
              className="!rounded-xl shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {items.map((d) => (
            <div
              key={d.id}
              className="min-w-[150px] max-w-[150px] shrink-0 rounded-xl border border-orange-100 bg-orange-50 p-3"
            >
              {d.image && (
                <img
                  src={d.image}
                  alt={d.title}
                  className="h-20 w-full rounded-lg object-cover mb-2"
                  loading="lazy"
                />
              )}
              <p className="text-sm font-semibold text-slate-800 truncate">
                {d.title}
              </p>
              <p className="text-xs text-slate-500">
                ₹{(d.discountedPrice ?? d.price ?? 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedDestinations;