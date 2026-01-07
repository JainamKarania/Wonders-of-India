import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import Banner from "../../assets/Banner.jpg";
import Banner2 from "../../assets/Dehli.jpg";
import {
  Search,
  LocationOn,
  CalendarToday,
  Route,
  ArrowForward,
  Tune,
  ExpandMore,
} from "@mui/icons-material";

/* --------------------------- COMPONENT ---------------------------- */
const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [bestDealOnly, setBestDealOnly] = useState(false);
  const [comboOnly, setComboOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState("all");

  const [showFilters, setShowFilters] = useState(false);

  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );

        /**
         * Map backend data → UI structure
         */
        const mapped = res.data.data.map((item, index) => ({
          id: index + 1,
          title: item.title,
          duration: "3 Days / 2 Nights",
          route: item.route,
          locations: item.name?.split(","),
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
          days: [
            "Arrival & local sightseeing",
            "Guided city exploration",
            "Departure & leisure time",
          ],
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

  /* ------------------------ ANIMATION ------------------------ */
  useEffect(() => {
    gsap.fromTo(
      sectionRef?.current?.querySelectorAll(".itinerary"),
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
    );
  }, [page, activeTab]);

  /* ------------------------ FILTER LOGIC ------------------------ */
  const filteredData = useMemo(() => {
    return itineraries.filter((pkg) => {
      if (activeTab !== "all" && pkg.type !== activeTab) return false;
      if (bestDealOnly && pkg.badge !== "Best Deal") return false;
      if (comboOnly && !pkg.combo) return false;
      if (selectedLocation && !pkg.locations?.includes(selectedLocation))
        return false;
      if (search && !pkg.title?.toLowerCase()?.includes(search?.toLowerCase()))
        return false;
      if (pkg.discountedPrice > maxPrice) return false;
      return true;
    });
  }, [itineraries,activeTab, bestDealOnly, comboOnly, selectedLocation, search, maxPrice]);

  /* ------------------------ PAGINATION ------------------------ */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center py-40">Loading itineraries…</p>;
  if (error) return <p className="text-center py-40 text-red-500">{error}</p>;

  return (
    <section ref={sectionRef} className="bg-white text-black py-28 px-6">
      {/* Header */}
      <header className="container max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl md:text-6xl font-bold">
          Explore India Your Way
        </h2>
        {/* <p className="text-slate-400 mt-3">
          Filter and book curated journeys by{" "}
          <span className="text-amber-400">Wonders of India</span>
        </p> */}
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
        {/* ================= FILTER PANEL ================= */}
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
            {/* Header (mobile only) */}
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

            {/* Filters */}
            <div className="space-y-6">
              {/* Search */}
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

              {/* Location */}
              {/* <select
                className="p-2 w-full text-sm border rounded-xl"
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option>Jaipur</option>
                <option>Udaipur</option>
                <option>Varanasi</option>
              </select> */}

              {/* Price Checkboxes */}
              <div className="space-y-2 text-sm">
                <p className="font-medium">Price Range</p>
                {[
                  { label: "Below ₹15,000", value: 15000 },
                  { label: "₹15,000 – ₹20,000", value: 20000 },
                  { label: "₹20,000 – ₹30,000", value: 30000 },
                  { label: "Above ₹30,000", value: 50000 },
                ].map((p) => (
                  <label key={p.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => setMaxPrice(p.value)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>

              {/* Toggles */}
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

        {/* Mobile Filters Button */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden mb-6 inline-flex items-center gap-2
             px-5 py-2 rounded-full bg-slate-900 text-white text-sm"
        >
          <Tune fontSize="small" />
          Filters
        </button>

        {/* ================= CONTENT ================= */}
        <main>
          {/* Tabs */}
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

          {/* Cards */}
          <div className="space-y-16">
            {paginatedData.map((trip) => (
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
                   <span className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-300"> {trip.tag} </span> 
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="flex gap-2">
                      <CalendarToday fontSize="small" />
                      {trip.duration}
                    </span>
                    <span className="flex gap-2">
                      <Route fontSize="small" />
                      {trip.route}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedId(expandedId === trip.id ? null : trip.id)
                    }
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    Day-wise Itinerary
                    <ExpandMore
                      className="transition-transform"
                      style={{
                        transform:
                          expandedId === trip.id || expandedId === "all"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {(expandedId === trip.id || expandedId === "all") && (
                    <ul className="relative pl-6 space-y-3 text-sm">
                      <span className="absolute left-[9px] top-0 h-full w-[2px] bg-slate-700" />
                      {trip.days.map((day, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span className="w-3 h-3 mt-1 rounded-full bg-amber-400" />{" "}
                          <p>
                            <strong>Day {idx + 1}:</strong> {day}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold">
                        ₹{trip.discountedPrice.toLocaleString()}
                      </span>
                      <span className="line-through ml-2 text-slate-400">
                        ₹{trip.price?.toLocaleString()}
                      </span>
                    </div>

                    <Link to = '/booking'><button className="px-6 py-3 bg-amber-400 rounded-full font-semibold">
                      Book Package <ArrowForward />
                    </button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
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
        </main>
      </div>
    </section>
  );
};

export default Itineraries;