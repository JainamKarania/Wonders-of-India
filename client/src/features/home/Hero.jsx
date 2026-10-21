import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, MapPin, ArrowRight, Sparkles } from "lucide-react";
import Islands from "../../assets/Islands.mp4";

const MAX_SUGGESTIONS = 6;
const MAX_QUICK_PICKS = 4;

const extractNames = (items) => {
  const names = items.flatMap((item) => {
    if (Array.isArray(item.locations)) {
      return item.locations.map((loc) => String(loc).trim());
    }
    if (typeof item.locations === "string" && item.locations) {
      return item.locations.split(",").map((loc) => loc.trim());
    }
    return item.title ? [item.title] : [];
  });

  return [...new Set(names)].filter(Boolean).sort();
};

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadNames = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );
        if (!cancelled) setDestinations(extractNames(res.data.data ?? []));
      } catch (err) {
        console.error(err);
      }
    };

    loadNames();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return destinations
      .filter((d) => d.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [query, destinations]);

  const quickPicks = destinations.slice(0, MAX_QUICK_PICKS);
  const showList = open && suggestions.length > 0;

  const goToDestinations = (value) => {
    const trimmed = value.trim();
    navigate(
      trimmed ? `/destination?search=${encodeURIComponent(trimmed)}` : "/destination"
    );
  };

  const handleSelect = (value) => {
    setQuery(value);
    setOpen(false);
    goToDestinations(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    goToDestinations(query);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && showList) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70 motion-reduce:hidden"
      >
        <source src={Islands} type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/35 to-ink-900/85"
      />

      <div className="container-page relative z-10 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur sm:text-sm">
            <Sparkles size={14} className="text-brand-300" aria-hidden="true" />
            Curated journeys across India
          </span>

          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-extrabold leading-[1.1] text-white text-balance sm:text-5xl lg:text-6xl"
          >
            Find your next adventure in{" "}
            <span className="text-brand-400">Incredible India</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Handpicked destinations, ready-made itineraries and an AI assistant
            to plan it all with you.
          </p>

          <div ref={searchRef} className="relative mx-auto mt-9 max-w-xl text-left">
            <form
              role="search"
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-lift sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  size={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <label htmlFor="hero-search" className="sr-only">
                  Search destinations
                </label>
                <input
                  id="hero-search"
                  type="text"
                  role="combobox"
                  aria-expanded={showList}
                  aria-controls="hero-suggestions"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    activeIndex >= 0 ? `hero-option-${activeIndex}` : undefined
                  }
                  autoComplete="off"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => setOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Where do you want to go?"
                  className="h-12 w-full rounded-xl bg-transparent pl-12 pr-4 text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary sm:px-8">
                Search
              </button>
            </form>

            {showList && (
              <ul
                id="hero-suggestions"
                role="listbox"
                className="card absolute left-0 right-0 z-20 mt-2 max-h-60 animate-fade-in overflow-y-auto p-1.5 shadow-lift"
              >
                {suggestions.map((item, i) => (
                  <li
                    key={item}
                    id={`hero-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-ink-800 transition ${
                        i === activeIndex ? "bg-brand-50" : "hover:bg-ink-50"
                      }`}
                    >
                      <MapPin size={16} aria-hidden="true" className="text-brand-600" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {quickPicks.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-white/70">Popular:</span>
              {quickPicks.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelect(name)}
                  className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/destination" className="btn bg-white text-ink-900 hover:bg-ink-100">
              Explore packages
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/chat"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              <Sparkles size={18} aria-hidden="true" />
              Plan with AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}