import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  X,
  CalendarDays,
  Route,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
} from "lucide-react";
import ItineraryModal from "../ItineraryModal";

const PRICE_RANGES = [
  { label: "Below ₹15,000", min: 0, max: 15000 },
  { label: "₹15,000 – ₹20,000", min: 15000, max: 20000 },
  { label: "₹20,000 – ₹30,000", min: 20000, max: 30000 },
  { label: "Above ₹30,000", min: 30000, max: Infinity },
];

const TABS = [
  { key: "all", label: "All packages" },
  { key: "best", label: "Best deals" },
  { key: "recommended", label: "Recommended" },
];

const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

const ITEMS_PER_PAGE = 6;

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const formatPrice = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const normalize = (item) => {
  const locations = toList(item.locations);
  const tag = item.tag ?? "";

  return {
    id: item.id,
    title: item.title,
    duration: item.duration || null,
    locations,
    route: locations.join(" → "),
    price: item.price,
    discountedPrice: item.discountedPrice,
    effectivePrice: item.discountedPrice ?? item.price ?? 0,
    image: item.image,
    tag,
    type:
      tag === "Best Seller"
        ? "best"
        : tag === "Recommended"
        ? "recommended"
        : "all",
    combo: tag.toLowerCase().includes("combo"),
  };
};

function FilterPanel({
  idPrefix,
  search,
  setSearch,
  locations,
  selectedLocation,
  setSelectedLocation,
  priceRange,
  setPriceRange,
  comboOnly,
  setComboOnly,
  activeCount,
  onClear,
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-ink-900">
          <SlidersHorizontal size={18} aria-hidden="true" />
          Filters
        </h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <label htmlFor={`${idPrefix}-search`} className="label">
          Search
        </label>
        <div className="relative">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            id={`${idPrefix}-search`}
            className="input pl-10"
            placeholder="Jaipur, Varanasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {locations.length > 0 && (
        <div>
          <label htmlFor={`${idPrefix}-location`} className="label">
            Location
          </label>
          <select
            id={`${idPrefix}-location`}
            className="input"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      )}

      <fieldset>
        <legend className="label">Price range</legend>
        <div className="space-y-1">
          <label className="flex min-h-[40px] cursor-pointer items-center gap-3 text-sm text-ink-700">
            <input
              type="radio"
              name={`${idPrefix}-price`}
              checked={priceRange === null}
              onChange={() => setPriceRange(null)}
              className="h-4 w-4 accent-brand-600"
            />
            Any price
          </label>
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className="flex min-h-[40px] cursor-pointer items-center gap-3 text-sm text-ink-700"
            >
              <input
                type="radio"
                name={`${idPrefix}-price`}
                checked={priceRange?.label === range.label}
                onChange={() => setPriceRange(range)}
                className="h-4 w-4 accent-brand-600"
              />
              {range.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex min-h-[40px] cursor-pointer items-center gap-3 text-sm font-medium text-ink-800">
        <input
          type="checkbox"
          checked={comboOnly}
          onChange={() => setComboOnly(!comboOnly)}
          className="h-4 w-4 rounded accent-brand-600"
        />
        Combo packages only
      </label>
    </div>
  );
}

function TripCard({ trip, details, isExpanded, onToggle, onReview }) {
  const hasDiscount =
    trip.discountedPrice && trip.price && trip.discountedPrice < trip.price;

  return (
    <article className="card overflow-hidden lg:grid lg:grid-cols-[2fr_3fr]">
      <div className="relative h-56 bg-gradient-to-br from-brand-100 to-brand-200 sm:h-64 lg:h-auto lg:min-h-[280px]">
        {trip.image ? (
          <img
            src={trip.image}
            alt={trip.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-500">
            <MapPin size={40} aria-hidden="true" />
          </div>
        )}
        {trip.tag && (
          <span className="badge absolute left-4 top-4 bg-white/95 text-ink-900 shadow-soft">
            {trip.tag}
          </span>
        )}
      </div>

      <div className="flex flex-col p-5 sm:p-6">
        <h3 className="text-xl font-bold text-ink-900 sm:text-2xl">
          {trip.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
          <span className="flex items-center gap-2">
            <CalendarDays size={16} aria-hidden="true" className="text-brand-600" />
            {trip.duration ?? "Duration coming soon"}
          </span>
          {trip.route && (
            <span className="flex items-center gap-2">
              <Route size={16} aria-hidden="true" className="shrink-0 text-brand-600" />
              {trip.route}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={`days-${trip.id}`}
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Day-wise itinerary
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>

        <div id={`days-${trip.id}`}>
          {isExpanded && (
            <div className="mt-3">
              {details?.loading && (
                <div className="space-y-3" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skeleton h-10" />
                  ))}
                </div>
              )}

              {details?.error && (
                <p className="text-sm text-red-600">{details.error}</p>
              )}

              {details && !details.loading && !details.error && (
                <>
                  {details.days.length === 0 ? (
                    <p className="text-sm text-ink-500">
                      Day-wise details for this package are coming soon.
                    </p>
                  ) : (
                    <ol className="relative ml-2 space-y-5 border-l-2 border-brand-100 pl-6">
                      {details.days.map((day) => (
                        <li key={day.dayNumber} className="relative">
                          <span
                            aria-hidden="true"
                            className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-brand-600 ring-4 ring-white"
                          />
                          <p className="text-sm font-semibold text-ink-900">
                            Day {day.dayNumber}: {day.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-ink-600">
                            {day.description}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {hasDiscount && (
              <p className="text-sm text-ink-400 line-through">
                {formatPrice(trip.price)}
              </p>
            )}
            {trip.effectivePrice > 0 && (
              <p className="text-2xl font-extrabold text-ink-900">
                {formatPrice(trip.effectivePrice)}
                <span className="ml-1 text-xs font-medium text-ink-500">
                  / person
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onReview} className="btn-outline">
              Review itinerary
            </button>
            <Link to={`/booking?destinationId=${trip.id}`} className="btn-primary">
              Book package
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden lg:grid lg:grid-cols-[2fr_3fr]" aria-hidden="true">
      <div className="skeleton h-56 !rounded-none lg:h-72" />
      <div className="space-y-4 p-6">
        <div className="skeleton h-7 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton mt-8 h-12 w-full" />
      </div>
    </div>
  );
}

export default function Itineraries() {
  const [searchParams] = useSearchParams();

  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [comboOnly, setComboOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [itineraryDetails, setItineraryDetails] = useState({});
  const [modalDestinationId, setModalDestinationId] = useState(null);

  const listTopRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );

        if (!cancelled) setItineraries((res.data.data ?? []).map(normalize));
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn't load the packages. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, comboOnly, selectedLocation, search, priceRange, sort]);

  useEffect(() => {
    if (!showFilters) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowFilters(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showFilters]);

  const allLocations = useMemo(() => {
    const set = new Set();
    itineraries.forEach((it) => it.locations.forEach((loc) => set.add(loc)));
    return [...set].sort();
  }, [itineraries]);

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();

    const result = itineraries.filter((pkg) => {
      if (activeTab !== "all" && pkg.type !== activeTab) return false;
      if (comboOnly && !pkg.combo) return false;
      if (selectedLocation && !pkg.locations.includes(selectedLocation)) return false;

      if (q) {
        const inTitle = pkg.title?.toLowerCase().includes(q);
        const inLocations = pkg.locations.some((loc) => loc.toLowerCase().includes(q));
        if (!inTitle && !inLocations) return false;
      }

      if (
        priceRange &&
        (pkg.effectivePrice < priceRange.min || pkg.effectivePrice >= priceRange.max)
      ) {
        return false;
      }

      return true;
    });

    if (sort === "price-asc") {
      result.sort((a, b) => a.effectivePrice - b.effectivePrice);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.effectivePrice - a.effectivePrice);
    }

    return result;
  }, [itineraries, activeTab, comboOnly, selectedLocation, search, priceRange, sort]);

  const activeFilterCount = [
    comboOnly,
    Boolean(selectedLocation),
    Boolean(search.trim()),
    Boolean(priceRange),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setSelectedLocation("");
    setPriceRange(null);
    setComboOnly(false);
    setActiveTab("all");
  };

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const goToPage = (next) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExpand = async (id) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);

    if (next && !itineraryDetails[next]) {
      setItineraryDetails((prev) => ({ ...prev, [next]: { loading: true } }));

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/itinerary?destinationId=${next}`
        );
        if (!res.data.success) throw new Error(res.data.message);

        setItineraryDetails((prev) => ({
          ...prev,
          [next]: { loading: false, days: res.data.data.days ?? [] },
        }));
      } catch (err) {
        console.error(err);
        setItineraryDetails((prev) => ({
          ...prev,
          [next]: { loading: false, error: "Failed to load day-wise details." },
        }));
      }
    }
  };

  const filterProps = {
    search,
    setSearch,
    locations: allLocations,
    selectedLocation,
    setSelectedLocation,
    priceRange,
    setPriceRange,
    comboOnly,
    setComboOnly,
    activeCount: activeFilterCount,
    onClear: clearFilters,
  };

  return (
    <section className="section bg-ink-50">
      <div className="container-page">
        <header className="max-w-2xl">
          <p className="eyebrow">Packages &amp; itineraries</p>
          <h2 className="section-title mt-3">Explore India your way</h2>
          <p className="section-subtitle">
            Compare curated packages, preview the day-by-day plan and book when
            you're ready.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="card sticky top-24 p-6">
              <FilterPanel idPrefix="desktop" {...filterProps} />
            </div>
          </aside>

          <main>
            <div ref={listTopRef} className="scroll-mt-28" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="tablist"
                aria-label="Package type"
                className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-ink-900 text-white"
                        : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="btn-outline flex-1 lg:hidden"
                >
                  <SlidersHorizontal size={18} aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <label className="sr-only" htmlFor="sort-select">
                  Sort packages
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input !w-auto flex-1 sm:flex-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!loading && !error && (
              <p className="mt-5 text-sm text-ink-500" aria-live="polite">
                {filteredData.length} package{filteredData.length === 1 ? "" : "s"} found
              </p>
            )}

            <div className="mt-5 space-y-6">
              {loading &&
                [0, 1, 2].map((i) => <SkeletonCard key={i} />)}

              {!loading && error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center"
                >
                  <p className="text-sm font-medium text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="btn-outline mt-4"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && paginatedData.length === 0 && (
                <div className="card p-10 text-center">
                  <Search size={32} aria-hidden="true" className="mx-auto text-ink-300" />
                  <p className="mt-3 font-medium text-ink-700">
                    No packages match these filters.
                  </p>
                  {(activeFilterCount > 0 || activeTab !== "all") && (
                    <button type="button" onClick={clearFilters} className="btn-outline mt-5">
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {!loading &&
                !error &&
                paginatedData.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    details={itineraryDetails[trip.id]}
                    isExpanded={expandedId === trip.id}
                    onToggle={() => toggleExpand(trip.id)}
                    onReview={() => setModalDestinationId(trip.id)}
                  />
                ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-10 flex items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="btn-outline !min-h-[44px] !px-3"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToPage(i + 1)}
                    aria-current={page === i + 1 ? "page" : undefined}
                    className={`h-11 w-11 rounded-xl text-sm font-semibold transition ${
                      page === i + 1
                        ? "bg-brand-600 text-white shadow-glow"
                        : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="btn-outline !min-h-[44px] !px-3"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </nav>
            )}
          </main>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          showFilters ? "" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setShowFilters(false)}
          aria-hidden="true"
          className={`absolute inset-0 bg-ink-900/50 backdrop-blur-sm transition-opacity duration-300 ${
            showFilters ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-lift transition-[transform,visibility] duration-300 ${
            showFilters ? "visible translate-x-0" : "invisible translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <p className="font-bold text-ink-900">Refine results</p>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              aria-label="Close filters"
              className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-ink-100"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <FilterPanel idPrefix="mobile" {...filterProps} />
          </div>

          <div className="border-t border-ink-100 p-4">
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="btn-primary w-full"
            >
              Show {filteredData.length} package{filteredData.length === 1 ? "" : "s"}
            </button>
          </div>
        </aside>
      </div>

      <ItineraryModal
        open={modalDestinationId !== null}
        onClose={() => setModalDestinationId(null)}
        destinationId={modalDestinationId}
      />
    </section>
  );
}