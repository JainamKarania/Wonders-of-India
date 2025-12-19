import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HomeHero() {
//   const ref = useRef(null);
//   useEffect(() => {
//     gsap.from(ref.current.children, {
//       y: 80,
//       opacity: 0,
//       stagger: 0.2,
//       duration: 1,
//     });
//   }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-600 to-yellow-400 flex items-center">
      <div className="max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
          Experience Incredible India
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Curated journeys across heritage, nature, culture, and adventure.
        </p>
        <button className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold">
          Explore Wonders
        </button>
      </div>
    </section>
  );
}
