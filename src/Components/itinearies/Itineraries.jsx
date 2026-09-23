import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import {
  Search,
  CalendarToday,
  Route,
  ArrowForward,
  Tune,
  ExpandMore,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import ItineraryModal from "../ItineraryModal";

const PRICE_RANGES = [
  { label: "Below ₹15,000", min: 0, max: 15000 },
  { label: "₹15,000 – ₹20,000", min: 15000, max: 20000 },
  { label: "₹20,000 – ₹30,000", min: 20000, max: 30000 },
  { label: "Above ₹30,000", min: 30000, max: Infinity },
];

const ITEMS_PER_PAGE = 6;

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [bestDealOnly, setBestDealOnly] = useState(false);
  const [comboOnly, setComboOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Day-wise content is fetched lazily per card, only once expanded —
  // not embedded upfront, since it's real per-destination data now and
  // fetching all of it for every card on page load would be wasteful.
  const [itineraryDetails, setItineraryDetails] = useState({});
  const [modalDestinationId, setModalDestinationId] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );

        const mapped = (res.data.data ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          duration: item.duration || "Duration details coming soon",
          route: item.locations,
          locations: item.locations
            ?.split(",")
            .map((loc) => loc.trim())
            .filter(Boolean),
          price: item.price,
          discountedPrice: item.discountedPrice,
          image: item.image,
          tag: item.tag,
          type:
            item.tag === "Best Seller"
              ? "best"
              : item.tag === "Recommended"
              ? "recommended"
              : "all",
          combo: item.tag?.toLowerCase().includes("combo"),
        }));

        setItineraries(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  useEffect(() => {
    if (loading || itineraries.length === 0) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll(".itinerary"),
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, itineraries, page, activeTab]);

  const allLocations = useMemo(() => {
    const set = new Set();
    itineraries.forEach((it) => it.locations?.forEach((loc) => set.add(loc)));
    return [...set].sort();
  }, [itineraries]);

  const filteredData = useMemo(() => {
    return itineraries.filter((pkg) => {
      if (activeTab !== "all" && pkg.type !== activeTab) return false;
      if (bestDealOnly && pkg.tag !== "Best Seller") return false;
      if (comboOnly && !pkg.combo) return false;
      if (selectedLocation && !pkg.locations?.includes(selectedLocation))
        return false;
      if (search && !pkg.title?.toLowerCase()?.includes(search?.toLowerCase()))
        return false;
      if (
        priceRange &&
        (pkg.discountedPrice < priceRange.min || pkg.discountedPrice >= priceRange.max)
      )
        return false;
      return true;
    });
  }, [
    itineraries,
    activeTab,
    bestDealOnly,
    comboOnly,
    selectedLocation,
    search,
    priceRange,
  ]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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

  if (loading) return <p className="text-center py-40">Loading itineraries…</p>;
  if (error) return <p className="text-center py-40 text-red-500">{error}</p>;

  return (
    <section ref={sectionRef} className="bg-white text-black py-28 px-6">
      <header className="container max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl md:text-6xl font-bold">
          Explore India Your Way
        </h2>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        <aside
          className={`
    fixed inset-0 lg:z-40 z-50 bg-black/40 backdrop-blur-sm
    lg:static lg:bg-transparent lg:backdrop-blur-none
    ${showFilters ? "block" : "hidden"} lg:block
  `}
        >
          <div
            className="
      absolute right-0 top-0 h-full w-[280px]
      bg-slate-100 p-5 rounded-l-2xl
      overflow-y-auto lg:h-auto lg:w-full lg:rounded-xl
      lg:sticky lg:top-24
    "
          >
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Tune /> Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm">Search Destination</label>
                <div className="flex items-center mt-2 px-3 border rounded-xl">
                  <Search className="text-slate-400" />
                  <input
                    className="w-full px-2 py-2 text-sm outline-none"
                    placeholder="Jaipur, Varanasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {allLocations.length > 0 && (
                <div>
                  <label className="text-sm">Location</label>
                  <select
                    className="p-2 mt-2 w-full text-sm border rounded-xl"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {allLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <p className="font-medium">Price Range</p>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === null}
                    onChange={() => setPriceRange(null)}
                  />
                  Any price
                </label>
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange?.label === range.label}
                      onChange={() => setPriceRange(range)}
                    />
                    {range.label}
                  </label>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bestDealOnly}
                    onChange={() => setBestDealOnly(!bestDealOnly)}
                  />
                  Best Deals Only
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={comboOnly}
                    onChange={() => setComboOnly(!comboOnly)}
                  />
                  Combo Packages
                </label>
              </div>
            </div>
          </div>
        </aside>

        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden mb-6 inline-flex items-center gap-2
             px-5 py-2 rounded-full bg-slate-900 text-white text-sm"
        >
          <Tune fontSize="small" />
          Filters
        </button>

        <main>
          <nav className="flex gap-6 mb-10">
            {["all", "best", "recommended"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`pb-2 border-b-2 ${
                  activeTab === tab
                    ? "border-amber-400"
                    : "border-transparent text-slate-400"
                }`}
              >
                {tab === "all"
                  ? "All Packages"
                  : tab === "best"
                  ? "Best Deals"
                  : "Recommended"}
              </button>
            ))}
          </nav>

          {paginatedData.length === 0 && (
            <p className="text-slate-500">No packages match these filters.</p>
          )}

          <div className="space-y-16">
            {paginatedData.map((trip) => {
              const details = itineraryDetails[trip.id];
              const isExpanded = expandedId === trip.id;

              return (
                <article
                  key={trip.id}
                  className="itinerary grid grid-cols-1 lg:grid-cols-2 gap-10"
                >
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="h-[300px] w-full object-cover rounded-3xl"
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold">{trip.title}</h3>
                      {trip.tag && (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-300">
                          {trip.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="flex gap-2">
                        <CalendarToday fontSize="small" />
                        {trip.duration}
                      </span>
                      {trip.route && (
                        <span className="flex gap-2">
                          <Route fontSize="small" />
                          {trip.route}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpand(trip.id)}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      Day-wise Itinerary
                      <ExpandMore
                        className="transition-transform"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {isExpanded && (
                      <>
                        {details?.loading && (
                          <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton key={i} variant="text" height={40} />
                            ))}
                          </div>
                        )}

                        {details?.error && (
                          <p className="text-sm text-red-600">{details.error}</p>
                        )}

                        {details && !details.loading && !details.error && (
                          <>
                            {details.days.length === 0 ? (
                              <p className="text-sm text-slate-500">
                                Day-wise details for this package are coming soon.
                              </p>
                            ) : (
                              <ul className="relative pl-6 space-y-3 text-sm">
                                <span className="absolute left-[9px] top-0 h-full w-[2px] bg-slate-700" />
                                {details.days.map((day) => (
                                  <li key={day.dayNumber} className="flex gap-4">
                                    <span className="w-3 h-3 mt-1 rounded-full bg-amber-400" />
                                    <p>
                                      <strong>
                                        Day {day.dayNumber}: {day.title}
                                      </strong>
                                      <br />
                                      {day.description}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold">
                          ₹{trip.discountedPrice?.toLocaleString()}
                        </span>
                        {trip.price && (
                          <span className="line-through ml-2 text-slate-400">
                            ₹{trip.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setModalDestinationId(trip.id)}
                          className="px-5 py-3 border-2 border-slate-900 rounded-full font-semibold text-sm hover:bg-slate-900 hover:text-white transition"
                        >
                          Review Itinerary
                        </button>

                        <Link to={`/booking?destinationId=${trip.id}`}>
                          <button className="px-6 py-3 bg-amber-400 rounded-full font-semibold">
                            Book Package <ArrowForward />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-16">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-full ${
                    page === i + 1 ? "bg-amber-400" : "bg-slate-800 text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <ItineraryModal
        open={modalDestinationId !== null}
        onClose={() => setModalDestinationId(null)}
        destinationId={modalDestinationId}
      />
    </section>
  );
};

export default Itineraries;