import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Card, CardContent, Chip, Skeleton } from "@mui/material";
import { LocationOn, LocalOffer } from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function DestinationSlider() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(".swiper-slide", {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sliderRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [itineraries]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );

        const mapped = res.data.data?.map((item, index) => ({
          id: index + 1,
          title: item.title,
          locations: item.locations,
          price: item.price,
          discountedPrice: item.discountedPrice,
          image: item.image,
          tag: item.tag,
        }));

        setItineraries(mapped ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load itineraries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="popular-destinations-heading"
      className="relative overflow-hidden bg-slate-50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,white,transparent_70%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <header
          ref={headingRef}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <h2
            id="popular-destinations-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
          >
            Popular Destinations in India
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Curated Indian journeys with exclusive deals and unforgettable
            experiences.
          </p>
        </header>

        <div ref={sliderRef} className="mt-12 sm:mt-16">
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white p-4 shadow-sm">
                  <Skeleton variant="rounded" height={208} className="!rounded-2xl" />
                  <Skeleton className="mt-4" width="60%" />
                  <Skeleton width="40%" />
                  <Skeleton variant="rounded" height={60} className="!mt-2 !rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && itineraries.length === 0 && (
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-sm font-medium text-slate-600">
                No destinations available right now — check back soon.
              </p>
            </div>
          )}

          {!loading && !error && itineraries.length > 0 && (
            <div className="px-1 sm:px-8">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                loop
                grabCursor
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                style={{
                  "--swiper-navigation-color": "#f97316",
                  "--swiper-navigation-size": "20px",
                }}
              >
                {itineraries.map((dest) => (
                  <SwiperSlide key={dest.id}>
                    <Card
                      elevation={0}
                      className="group h-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-xl"
                    >
                      <div className="relative h-48 overflow-hidden sm:h-52">
                        <img
                          src={dest.image}
                          alt={dest.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {dest.tag && (
                          <Chip
                            label={dest.tag}
                            size="small"
                            className="!absolute right-4 top-4 !bg-emerald-500 !text-white"
                          />
                        )}
                      </div>

                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <LocationOn fontSize="small" />
                          <span className="text-sm font-medium">
                            {dest.locations || dest.title}
                          </span>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {dest.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            {dest.price && (
                              <span className="text-sm line-through text-slate-400">
                                ₹{dest.price.toLocaleString()}
                              </span>
                            )}
                            {dest.discountedPrice && (
                              <span className="text-lg font-bold text-emerald-600">
                                ₹{dest.discountedPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Link to="/booking" className="w-full sm:w-auto">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<LocalOffer />}
                              className="!w-full !rounded-xl !bg-slate-900 !px-4 !py-2 !text-xs !font-semibold !normal-case hover:!bg-black sm:!w-auto"
                            >
                              Book Package
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}