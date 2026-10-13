import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Quote, Star } from "lucide-react";

function Stars({ value }) {
  return (
    <div
      role="img"
      aria-label={`${value} out of 5 stars`}
      className="flex gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));

        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <Star
              size={16}
              aria-hidden="true"
              className="absolute inset-0 fill-ink-200 text-ink-200"
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={16}
                aria-hidden="true"
                className="fill-amber-400 text-amber-400"
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <figure className="card flex h-full w-[85%] shrink-0 snap-center flex-col p-6 sm:w-auto sm:shrink">
      <Quote
        size={28}
        aria-hidden="true"
        className="fill-brand-100 text-brand-300"
      />

      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-700">
        {review.review}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white"
        >
          {review.name?.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">
            {review.name}
          </p>
          <Stars value={Number(review.rating) || 0} />
        </div>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reviews`
        );
        if (!cancelled) setReviews(res.data.data ?? []);
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

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  if (!loading && reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-heading" className="section bg-white">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 id="reviews-heading" className="section-title mt-3">
            Loved by happy travelers
          </h2>

          {!loading && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <Stars value={average} />
              <p className="text-sm text-ink-600">
                <span className="font-semibold text-ink-900">
                  {average.toFixed(1)}
                </span>{" "}
                from {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>
          )}
        </header>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-56" />
            ))}
          </div>
        ) : (
          <div className="scrollbar-hide -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id ?? `${review.name}-${i}`} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}