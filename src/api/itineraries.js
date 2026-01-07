export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      title: "Mumbai City Lights Experience",
      description:
        "India’s financial capital blending colonial landmarks, Bollywood glamour, and vibrant street life.",
      image:
        "https://images.unsplash.com/photo-1602643163983-ed0babc39797?q=80&w=1200",
      duration: null,
      route: "Mumbai → Mumbai Darshan → Bollywood Tour",
      locations: ["Mumbai"],
      price: 34999,
      discountedPrice: 27999,
      tag: "Best Seller",
      badge: null,
      combo: false,
      days: [
        "Arrival & Gateway of India visit",
        "Bollywood studio tour & Marine Drive evening",
        "Colaba market exploration & departure",
      ],
    },
    {
      id: 2,
      title: "Goa Sun & Sand Getaway",
      description:
        "Golden beaches, nightlife, and relaxed vibes with the perfect tropical escape.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",

      duration: null,
      route: "Goa → Beaches → Water Sports",
      locations: ["Goa"],

      price: 29999,
      discountedPrice: 23999,
      tag: "Hot Deal",
      badge: null,

      combo: false,
      days: [
        "Arrival & beach relaxation",
        "Water sports & local market exploration",
        "Sunset cruise & nightlife experience",
      ],
    },
    {
      id: 3,
      title: "Royal Rajasthan Trail",
      description:
        "Explore the royal heritage of Rajasthan covering Jaipur, Jodhpur, and Udaipur.",
      image: null,

      duration: "3 Days / 2 Nights",
      route: "Jaipur → Jodhpur → Udaipur",
      locations: ["Jaipur", "Jodhpur", "Udaipur"],

      price: 42000,
      discountedPrice: 34999,
      tag: "Best Deal",
      badge: "Best Deal",

      combo: true,
      days: [
        "Arrival & Jaipur City Palace tour",
        "Amber Fort, Jal Mahal & local bazaars",
        "Jodhpur – Mehrangarh Fort & Blue City walk",
      ],
    },
    {
      id: 4,
      title: "Spiritual Varanasi Escape",
      description:
        "A peaceful spiritual journey covering Varanasi and Sarnath.",
      image: null,

      duration: "3 Days / 2 Nights",
      route: "Varanasi → Sarnath",
      locations: ["Varanasi", "Sarnath"],

      price: 18000,
      discountedPrice: 14999,
      tag: "Recommended",
      badge: "Recommended",

      combo: false,
      days: [
        "Arrival & evening Ganga Aarti",
        "Sunrise boat ride & Kashi temple walk",
        "Sarnath Buddhist circuit & departure",
      ],
    },
    {
      id: 5,
      title: "Kerala Backwaters Serenity Escape",
      description:
        "Serene houseboats, lush greenery, and tranquil waterways in Kerala.",
      image: null,
      duration: null,
      route: "Kerala Backwaters → Houseboat Stay → Village Tour",
      locations: ["Kerala Backwaters"],
      price: 36999,
      discountedPrice: 29999,
      tag: "Recommended",
      badge: "Recommended",
      combo: false,
      days: [
        "Arrival & houseboat boarding",
        "Village tour & local culture experience",
        "Sunset cruise & backwater relaxation",
      ],
    },
    {
      id: 6,
      title: "Ladakh High-Altitude Adventure",
      description:
        "A thrilling journey through the high-altitude landscapes of Ladakh, including visits to monasteries, lakes, and mountain passes.",
      image: null,
      duration: null,
      route: "Leh → Monasteries → Pangong Lake → Nubra Valley",
      locations: ["Leh", "Pangong Lake", "Nubra Valley"],
      price: 49999,
      discountedPrice: 41999,
      tag: "Adventure",
      badge: "Adventure",
      combo: false,
      days: [
        "Arrival & local sightseeing in Leh",
        "Monastery visits & Pangong Lake excursion",
        "Nubra Valley tour & departure",
      ],
    },
    {
      id: 7,
      title: "Delhi Heritage & Culture Trail",
      description:
        "A historic capital showcasing Mughal monuments, bustling markets, and modern city vibes.",
      image: null,
      duration: null,
      route: "Delhi → Red Fort → Qutub Minar → India Gate",
      locations: ["Delhi", "Red Fort", "Qutub Minar", "India Gate"],
      price: 26999,
      discountedPrice: 21999,
      tag: "Historic Icon",
      badge: "Historic Icon",
      combo: false,
      days: [
        "Arrival & Red Fort tour",
        "Qutub Minar & Humayun's Tomb visit",
        "India Gate & local market exploration",
      ],
    },
    {
      id: 8,
      title: "Himalayan Trekking Adventure",
      description:
        "An exhilarating trek through the majestic Himalayas, offering breathtaking views and cultural experiences.",
      image: null,
      duration: null,
      route: "Manali → Trekking Routes → Mountain Passes",
      locations: ["Manali", "Trekking Routes", "Mountain Passes"],
      price: 39999,
      discountedPrice: 32999,
      tag: "Adventure",
      badge: "Adventure",
      combo: false,
      days: [
        "Arrival & local sightseeing in Manali",
        "Trekking routes & mountain pass exploration",
        "Departure & cultural experience",
      ],
    },
  ]);
}
