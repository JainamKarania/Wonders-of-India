import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Skeleton,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import gsap from "gsap";
import axios from "axios";

// The circular layout only has room for so many cards before they start
// overlapping — cap what the circle shows, while the mobile grid below
// can still list every review that came back from the API.
const MAX_CIRCLE_REVIEWS = 6;
const CIRCLE_SIZE = 600;
const CARD_RADIUS = 300 + 112; // matches the original design's 412px offset

const ReviewsCircular = () => {
  const circleRef = useRef(null);
  const cardsRef = useRef([]);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reviews`
        );
        setReviews(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const circleReviews = reviews.slice(0, MAX_CIRCLE_REVIEWS);

  // Reset the ref array every render so shrinking/reordering review lists
  // never leaves stale DOM references behind for GSAP to animate.
  cardsRef.current = [];

  useEffect(() => {
    if (loading || error || circleReviews.length === 0) return undefined;

    gsap.to(circleRef.current, {
      rotate: 360,
      duration: 40,
      repeat: -1,
      ease: "linear",
      transformOrigin: "50% 50%",
    });

    gsap.to(cardsRef.current, {
      rotate: -360,
      duration: 40,
      repeat: -1,
      ease: "linear",
      transformOrigin: "50% 50%",
    });

    return () => {
      gsap.killTweensOf(circleRef.current);
      gsap.killTweensOf(cardsRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, circleReviews.length]);

  return (
    <section className="w-full pt-20 pb-48 bg-gradient-to-b from-orange-50 to-white">
      <div className="text-center mb-16 lg:mb-44 px-4">
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

      {loading && (
        <div className="hidden lg:flex justify-center items-center">
          <Skeleton
            variant="circular"
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
          />
        </div>
      )}

      {!loading && error && (
        <p className="text-center text-gray-500">{error}</p>
      )}

      {!loading && !error && circleReviews.length > 0 && (
        <div className="hidden lg:flex justify-center items-center">
          <div
            ref={circleRef}
            className="relative rounded-full border-2 border-orange-200"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
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

            {/* Reviews — positioned evenly around the circle based on
                however many loaded, instead of 4 fixed clock positions */}
            {circleReviews.map((item, index) => {
              const angleDeg = (360 / circleReviews.length) * index - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = CARD_RADIUS * Math.cos(angleRad);
              const y = CARD_RADIUS * Math.sin(angleRad);

              return (
                <div
                  key={item.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="absolute w-56"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}
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
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile fallback */}
      <div className="lg:hidden px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={160} className="!rounded-xl" />
          ))}

        {!loading && error && (
          <p className="col-span-full text-center text-gray-500">{error}</p>
        )}

        {!loading &&
          !error &&
          reviews.map((item) => (
            <Card key={item.id} className="rounded-xl shadow-md">
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