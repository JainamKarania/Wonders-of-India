import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const formatLocations = (locations, fallback) => {
  if (Array.isArray(locations)) return locations.join(", ");
  return locations || fallback;
};

function DestinationCard({ dest }) {
  const hasDiscount =
    dest.discountedPrice && dest.price && dest.discountedPrice < dest.price;
  const discountPercent = hasDiscount
    ? Math.round(((dest.price - dest.discountedPrice) / dest.price) * 100)
    : 0;
  const currentPrice = dest.discountedPrice ?? dest.price;

  return (
    <article className="card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 sm:h-52">
        {dest.image ? (
          <img
            src={dest.image}
            alt={dest.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-500">
            <MapPin size={40} aria-hidden="true" />
          </div>
        )}

        {dest.tag && (
          <span className="badge absolute left-4 top-4 bg-white/95 text-ink-900 shadow-soft">
            {dest.tag}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="badge absolute right-4 top-4 bg-brand-600 text-white shadow-soft">
            {discountPercent}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin size={14} aria-hidden="true" className="shrink-0" />
          <span className="line-clamp-1">
            {formatLocations(dest.locations, dest.title)}
          </span>
        </p>

        <h3 className="mt-2 text-lg font-bold leading-snug text-ink-900">
          {dest.title}
        </h3>

        {dest.duration && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
            <Clock size={14} aria-hidden="true" />
            {dest.duration}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {hasDiscount && (
              <p className="text-sm text-ink-400 line-through">
                {formatPrice(dest.price)}
              </p>
            )}
            {currentPrice ? (
              <p className="text-xl font-extrabold text-ink-900">
                {formatPrice(currentPrice)}
                <span className="ml-1 text-xs font-medium text-ink-500">
                  / person
                </span>
              </p>
            ) : null}
          </div>

          <Link
            to={`/booking?destinationId=${dest.id}`}
            className="btn-primary !min-h-[40px] !px-4 !text-sm"
          >
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton h-48 !rounded-none sm:h-52" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export default function Destination() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );

        if (!cancelled) setDestinations(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn't load destinations. Please try again.");
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
      aria-labelledby="popular-destinations-heading"
      className="section bg-white"
    >
      <div className="container-page">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Top picks</p>
            <h2
              id="popular-destinations-heading"
              className="section-title mt-3"
            >
              Popular destinations in India
            </h2>
            <p className="section-subtitle">
              Curated journeys with exclusive deals and unforgettable
              experiences.
            </p>
          </div>

          <Link to="/destination" className="btn-outline shrink-0 self-start sm:self-auto">
            View all
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </header>

        <div className="mt-10 sm:mt-12">
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {!loading && !error && destinations.length === 0 && (
            <div className="mx-auto max-w-md rounded-2xl border border-ink-100 bg-ink-50 p-6 text-center text-sm font-medium text-ink-600">
              No destinations available right now. Check back soon.
            </div>
          )}

          {!loading && !error && destinations.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{ enabled: false }}
              pagination={{ clickable: true }}
              loop={destinations.length > 3}
              grabCursor
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1, navigation: { enabled: true } },
                768: { slidesPerView: 2, navigation: { enabled: true } },
                1024: { slidesPerView: 3, navigation: { enabled: true } },
              }}
              className="!px-1 !pb-12 !pt-1"
              style={{
                "--swiper-navigation-color": "#ea580c",
                "--swiper-navigation-size": "22px",
                "--swiper-pagination-color": "#ea580c",
                "--swiper-pagination-bullet-inactive-color": "#a39e93",
              }}
            >
              {destinations.map((dest) => (
                <SwiperSlide key={dest.id} className="!h-auto">
                  <DestinationCard dest={dest} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}