import { useEffect, useRef } from "react";
import gsap from "gsap";
import "swiper/css";
// import "swiper/css/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button, Card, CardContent, Chip } from "@mui/material";
import { LocationOn, LocalOffer, Visibility } from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

gsap.registerPlugin(ScrollTrigger);

export default function DestinationSlider() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current.children, {
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

  const destinations = [
    {
      name: "Jaipur, Rajasthan",
      desc: "Experience royal palaces, vibrant bazaars, and rich heritage in the Pink City.",
      image:
        "https://images.unsplash.com/photo-1602643163983-ed0babc39797?q=80&w=1200",
      package: "Jaipur Royal Heritage Tour",
      originalPrice: 34999,
      discountedPrice: 27999,
      tag: "Best Seller",
    },
    {
      name: "Goa",
      desc: "Golden beaches, nightlife, and relaxed vibes with the perfect tropical escape.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
      package: "Goa Sun & Sand Getaway",
      originalPrice: 29999,
      discountedPrice: 23999,
      tag: "Hot Deal",
    },
    {
      name: "Manali, Himachal Pradesh",
      desc: "Snow-capped mountains, adventure sports, and scenic valleys await you.",
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200",
      package: "Manali Himalayan Adventure Escape",
      originalPrice: 39999,
      discountedPrice: 31999,
      tag: "Recommended",
    },

    {
      name: "Mumbai, Maharashtra",
      desc: "India’s financial capital blending colonial landmarks, Bollywood glamour, and vibrant street life.",
      image:
        "https://images.unsplash.com/photo-1598434192043-71111c1b3f41?q=80&w=1200",
      package: "Mumbai City Lights Experience",
      originalPrice: 28999,
      discountedPrice: 22999,
      tag: "Urban Escape",
    },
    {
      name: "Kerala Backwaters",
      desc: "Serene houseboats, lush greenery, and tranquil waterways.",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200",
      package: "Kerala Backwaters Serenity Escape",
      originalPrice: 36999,
      discountedPrice: 29999,
      tag: "Couples Favorite",
    },
    {
      name: "Leh–Ladakh",
      desc: "High-altitude deserts, monasteries, and breathtaking Himalayan landscapes.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200",
      package: "Ladakh High-Altitude Adventure",
      originalPrice: 49999,
      discountedPrice: 41999,
      tag: "Bucket List",
    },
    {
      name: "Delhi",
      desc: "A historic capital showcasing Mughal monuments, bustling markets, and modern city vibes.",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200",
      package: "Delhi Heritage & Culture Trail",
      originalPrice: 26999,
      discountedPrice: 21999,
      tag: "Historic Icon",
    },
    {
      name: "Ayodhya, Uttar Pradesh",
      desc: "A sacred spiritual destination deeply rooted in Indian mythology and cultural heritage.",
      image:
        "https://images.unsplash.com/photo-1702115416496-40a4d0c2d9ad?q=80&w=1200",
      package: "Ayodhya Divine Pilgrimage Tour",
      originalPrice: 23999,
      discountedPrice: 18999,
      tag: "Spiritual Journey",
    },
    {
      name: "Bangalore, Karnataka",
      desc: "India’s Silicon Valley with lush gardens, breweries, and pleasant weather year-round.",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200",
      package: "Bangalore Urban Explorer Getaway",
      originalPrice: 25999,
      discountedPrice: 20999,
      tag: "City Break",
    },
    {
      name: "Pune, Maharashtra",
      desc: "A perfect blend of history, education hubs, hill views, and vibrant nightlife.",
      image:
        "https://images.unsplash.com/photo-1603349135288-1d7e8bb3b8e3?q=80&w=1200",
      package: "Pune Culture & Hills Retreat",
      originalPrice: 24999,
      discountedPrice: 19999,
      tag: "Weekend Favorite",
    },
    {
      name: "Ahmedabad, Gujarat",
      desc: "A UNESCO heritage city known for Sabarmati Ashram, architecture, and rich traditions.",
      image:
        "https://images.unsplash.com/photo-1622108545213-4f5b9f2f8d7b?q=80&w=1200",
      package: "Ahmedabad Heritage Walk Tour",
      originalPrice: 23999,
      discountedPrice: 18999,
      tag: "Cultural Gem",
    },
    {
      name: "Agra, Uttar Pradesh",
      desc: "Home to the iconic Taj Mahal, symbolizing eternal love and Mughal grandeur.",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200",
      package: "Agra Taj Mahal Golden Triangle Tour",
      originalPrice: 27999,
      discountedPrice: 22999,
      tag: "World Wonder",
    },
    {
      name: "Hyderabad, Telangana",
      desc: "A royal city of Nizams famous for Charminar, pearls, and world-renowned biryani.",
      image:
        "https://images.unsplash.com/photo-1604856420421-8fd52b9b67f8?q=80&w=1200",
      package: "Hyderabad Royal Nizam Experience",
      originalPrice: 26999,
      discountedPrice: 21999,
      tag: "Food Lover’s Pick",
    },
    {
      name: "Kutch, Gujarat",
      desc: "A white desert famous for Rann Utsav, handicrafts, and vibrant cultural festivals.",
      image:
        "https://images.unsplash.com/photo-1601118964938-0c9e4a06a4cf?q=80&w=1200",
      package: "Rann of Kutch Desert Festival Tour",
      originalPrice: 33999,
      discountedPrice: 27999,
      tag: "Cultural Festival",
    },
    {
      name: "Varanasi, Uttar Pradesh",
      desc: "One of the world’s oldest living cities offering sacred ghats and spiritual enlightenment.",
      image:
        "https://images.unsplash.com/photo-1600172454524-40c93a8e8a24?q=80&w=1200",
      package: "Varanasi Timeless Spiritual Journey",
      originalPrice: 25999,
      discountedPrice: 19999,
      tag: "Spiritual Icon",
    },
    {
      name: "Udaipur, Rajasthan",
      desc: "The romantic City of Lakes known for palaces, heritage stays, and sunset views.",
      image:
        "https://images.unsplash.com/photo-1609921212029-bb5a28e2dcb1?q=80&w=1200",
      package: "Udaipur Royal Lakes & Palaces Retreat",
      originalPrice: 32999,
      discountedPrice: 26999,
      tag: "Royal Luxury",
    },
    {
      name: "Rishikesh, Uttarakhand",
      desc: "The yoga capital of the world offering river rafting, meditation, and spiritual calm.",
      image:
        "https://images.unsplash.com/photo-1585136917971-7a8d6b3bdbfd?q=80&w=1200",
      package: "Rishikesh Yoga & Adventure Escape",
      originalPrice: 28999,
      discountedPrice: 22999,
      tag: "Wellness Retreat",
    },
    {
      name: "Shimla & Kufri, Himachal Pradesh",
      desc: "Colonial hill stations offering snowfall, toy train rides, and scenic mountain views.",
      image:
        "https://images.unsplash.com/photo-1593182440959-9f7e47e7b7e2?q=80&w=1200",
      package: "Shimla Kufri Snowy Hills Getaway",
      originalPrice: 35999,
      discountedPrice: 29999,
      tag: "Hill Station",
    },
    {
      name: "Darjeeling, West Bengal",
      desc: "Tea gardens, Himalayan views, and the iconic toy train charm.",
      image:
        "https://images.unsplash.com/photo-1580974852861-c381510bc98d?q=80&w=1200",
      package: "Darjeeling Tea & Mountain Trails",
      originalPrice: 36999,
      discountedPrice: 30999,
      tag: "Scenic Escape",
    },
    {
      name: "Andaman & Nicobar Islands",
      desc: "Pristine beaches, crystal-clear waters, coral reefs, and tropical serenity.",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200",
      package: "Andaman Tropical Island Paradise",
      originalPrice: 54999,
      discountedPrice: 45999,
      tag: "Island Luxury",
    },
    {
      name: "Kaziranga National Park, Assam",
      desc: "A UNESCO World Heritage site famous for one-horned rhinoceroses and wildlife safaris.",
      image:
        "https://images.unsplash.com/photo-1614699475490-47f0b64b9a6b?q=80&w=1200",
      package: "Kaziranga Wildlife Safari Adventure",
      originalPrice: 38999,
      discountedPrice: 31999,
      tag: "Wildlife Special",
    },
    {
      name: "Mysuru, Karnataka",
      desc: "A royal city known for Mysore Palace, yoga heritage, and Dasara celebrations.",
      image:
        "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=1200",
      package: "Mysuru Royal Heritage Experience",
      originalPrice: 25999,
      discountedPrice: 20999,
      tag: "Heritage City",
    },
    {
      name: "Sikkim",
      desc: "A serene Himalayan state with monasteries, alpine landscapes, and peaceful culture.",
      image:
        "https://images.unsplash.com/photo-1611078483046-9c8b6b6e7c53?q=80&w=1200",
      package: "Sikkim Himalayan Serenity Tour",
      originalPrice: 39999,
      discountedPrice: 33999,
      tag: "Hidden Gem",
    },
  ];

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
            {destinations.map((dest) => (
              <SwiperSlide key={dest.name}>
                <Card
                  elevation={0}
                  className="group h-full overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Chip
                      label={dest.tag}
                      size="small"
                      icon={<LocalOffer />}
                      className="!absolute left-4 top-4 !bg-amber-500 !text-white"
                    />
                  </div>

                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <LocationOn fontSize="small" />
                      <span className="text-sm font-medium">{dest.name}</span>
                    </div>

                    <p className="text-sm text-slate-700 line-clamp-3">
                      {dest.desc}
                    </p>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {dest.package}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm line-through text-slate-400">
                          ₹{dest.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-emerald-600">
                          ₹{dest.discountedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<LocalOffer />}
                        className="!rounded-xl !bg-slate-900 !px-4 !py-2 !text-xs !font-semibold !normal-case hover:!bg-black"
                      >
                        Book Package
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        className="!rounded-xl !border-slate-900 !px-4 !py-2 !text-xs !font-semibold !text-slate-900 !normal-case hover:!bg-slate-100"
                      >
                        View Itinerary
                      </Button>
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
