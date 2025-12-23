import { useState, useEffect, useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import axios from "axios";
import "swiper/css";
// import "swiper/css/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Card, CardContent, Chip } from "@mui/material";
import { LocationOn, LocalOffer, Visibility } from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// const BookingModal = lazy(() => import("./BookingModal"));

export default function DestinationSlider() {
  // const [open, setOpen] = useState(false);
  const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const sliderRef = useRef(null);

  // const [openBooking, setOpenBooking] = useState(false);

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
  }, []);

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
          locations: item.name?.split(","),
          price: item.price,
          discountedPrice: item.discountedPrice,
          image: item.image,
          tag: item.tag,
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

  if (loading) return <p className="text-center py-40">Loading itineraries…</p>;
  if (error) return <p className="text-center py-40 text-red-500">{error}</p>; 

  return (
    <section
      ref={sectionRef}
      aria-labelledby="popular-destinations-heading"
      className="relative overflow-hidden bg-slate-50"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,white,transparent_70%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <header
          ref={headingRef}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <h2
            id="popular-destinations-heading"
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Popular Destinations in India
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Curated Indian journeys with exclusive deals and unforgettable
            experiences.
          </p>
        </header>

        <div ref={sliderRef} className="mt-16">
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
          >
            {itineraries.map((dest) => (
              <SwiperSlide key={dest.title}>
                <Card
                  elevation={0}
                  className="group h-full overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Chip
                      label={dest.tag}
                      size="small"
                      // icon={<LocalOffer />}
                      className="!absolute right-4 top-4 !bg-emerald-500 !text-white"
                    />
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <LocationOn fontSize="small" />
                      <span className="text-sm font-medium">{dest.title}</span>
                    </div>

                    {/* <p className="text-sm text-slate-700 line-clamp-3">
                      {dest.desc}
                    </p> */}

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {dest.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm line-through text-slate-400">
                          ₹{dest.price?.toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                          ₹{dest.discountedPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Link to = '/booking'>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setOpen(true)}
                        startIcon={<LocalOffer />}
                        className="!rounded-xl !bg-slate-900 !px-4 !py-2 !text-xs !font-semibold !normal-case hover:!bg-black"
                      >
                        Book Package
                      </Button>
                      </Link>

                      {/* <Suspense
                        fallback={
                          <div className="text-center py-6">Loading...</div>
                        }
                      >
                        {open && (
                          <BookingModal
                            open={open}
                            onClose={() => setOpen(false)}
                          />
                        )}
                      </Suspense> */}

                      {/* <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        className="!rounded-xl !border-slate-900 !px-4 !py-2 !text-xs !font-semibold !text-slate-900 !normal-case hover:!bg-slate-100"
                      >
                        View Itinerary
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
