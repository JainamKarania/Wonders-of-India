import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import gsap from "gsap";

const reviews = [
  // 🕛 12 o’clock (Top – perfectly centered)
  {
    name: "Amit Sharma",
    review: "Perfect Rajasthan tour with excellent planning.",
    rating: 5,
    position: "top-[-112px] left-1/2 -translate-x-1/2",
  },

  // 🕒 3 o’clock (Right – perfectly centered)
  {
    name: "Neha Verma",
    review: "Kerala trip was peaceful and well organized.",
    rating: 4.5,
    position: "top-1/2 right-[-112px] -translate-y-1/2",
  },

  // 🕕 6 o’clock (Bottom – perfectly centered)
  {
    name: "Rahul Mehta",
    review: "Amazing experience and great customer support.",
    rating: 5,
    position: "bottom-[-112px] left-1/2 -translate-x-1/2",
  },

  // 🕘 9 o’clock (Left – perfectly centered)
  {
    name: "Priya Singh",
    review: "Loved the Kashmir trip. Highly recommended!",
    rating: 4.5,
    position: "top-1/2 left-[-112px] -translate-y-1/2",
  },
];

const ReviewsCircular = () => {
  const circleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Rotate the entire circle
    gsap.to(circleRef.current, {
      rotate: 360,
      duration: 40,
      repeat: -1,
      ease: "linear",
      transformOrigin: "50% 50%",
    });

    // Counter rotate cards so text stays upright
    gsap.to(cardsRef.current, {
      rotate: -360,
      duration: 40,
      repeat: -1,
      ease: "linear",
      transformOrigin: "50% 50%",
    });
  }, []);

  return (
    <section className="w-full pt-20 pb-48 bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="text-center mb-44 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Journey of Happy Travelers
        </h2>
        <p className="text-gray-600 mt-2">
          The lifecycle of trust at{" "}
          <span className="text-orange-500 font-semibold">
            Wonders of India
          </span>
        </p>
      </div>

      {/* Circular Layout */}
      <div className="hidden lg:flex justify-center items-center">
        <div
          ref={circleRef}
          className="relative w-[600px] h-[600px] rounded-full border-2 border-orange-200"
        >
          {/* Center Card (static) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="w-56 h-56 rounded-full flex items-center justify-center shadow-xl bg-white">
              <CardContent className="text-center">
                <TravelExploreIcon
                  className="text-orange-500 mb-2"
                  fontSize="large"
                />
                <Typography className="font-bold text-gray-800">
                  Wonders of India
                </Typography>
                <Typography className="text-xs text-gray-500 mt-1">
                  Trusted Travel Partner
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          {reviews.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`absolute ${item.position} w-56`}
            >
              <Card className="rounded-xl shadow-lg hover:shadow-xl transition">
                <CardContent className="p-4">
                  <FormatQuoteIcon className="text-orange-400 text-xl mb-1" />
                  <Typography className="text-xs text-gray-700 mb-2">
                    {item.review}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Avatar className="bg-orange-500 text-xs">
                      {item.name.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography className="text-xs font-semibold">
                        {item.name}
                      </Typography>
                      <Rating
                        value={item.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="lg:hidden px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {reviews.map((item, index) => (
          <Card key={index} className="rounded-xl shadow-md">
            <CardContent>
              <FormatQuoteIcon className="text-orange-400 mb-2" />
              <Typography className="text-sm text-gray-700 mb-3">
                {item.review}
              </Typography>
              <div className="flex items-center gap-3">
                <Avatar className="bg-orange-500">
                  {item.name.charAt(0)}
                </Avatar>
                <div>
                  <Typography className="font-semibold text-sm">
                    {item.name}
                  </Typography>
                  <Rating
                    value={item.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ReviewsCircular;
