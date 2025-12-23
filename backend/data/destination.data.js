// const destinations = [
//     {
//       name: "Jaipur, Rajasthan",
//       desc: "Experience royal palaces, vibrant bazaars, and rich heritage in the Pink City.",
//       image:
//         "https://images.unsplash.com/photo-1602643163983-ed0babc39797?q=80&w=1200",
//       package: "Jaipur Royal Heritage Tour",
//       originalPrice: 34999,
//       discountedPrice: 27999,
//       tag: "Best Seller",
//     },
//     {
//       name: "Goa",
//       desc: "Golden beaches, nightlife, and relaxed vibes with the perfect tropical escape.",
//       image:
//         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
//       package: "Goa Sun & Sand Getaway",
//       originalPrice: 29999,
//       discountedPrice: 23999,
//       tag: "Hot Deal",
//     },
//     {
//       name: "Manali, Himachal Pradesh",
//       desc: "Snow-capped mountains, adventure sports, and scenic valleys await you.",
//       image:
//         "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200",
//       package: "Manali Himalayan Adventure Escape",
//       originalPrice: 39999,
//       discountedPrice: 31999,
//       tag: "Recommended",
//     },

//     {
//       name: "Mumbai, Maharashtra",
//       desc: "India’s financial capital blending colonial landmarks, Bollywood glamour, and vibrant street life.",
//       image:
//         "https://images.unsplash.com/photo-1598434192043-71111c1b3f41?q=80&w=1200",
//       package: "Mumbai City Lights Experience",
//       originalPrice: 28999,
//       discountedPrice: 22999,
//       tag: "Urban Escape",
//     },
//     {
//       name: "Kerala Backwaters",
//       desc: "Serene houseboats, lush greenery, and tranquil waterways.",
//       image:
//         "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200",
//       package: "Kerala Backwaters Serenity Escape",
//       originalPrice: 36999,
//       discountedPrice: 29999,
//       tag: "Couples Favorite",
//     },
//     {
//       name: "Leh–Ladakh",
//       desc: "High-altitude deserts, monasteries, and breathtaking Himalayan landscapes.",
//       image:
//         "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200",
//       package: "Ladakh High-Altitude Adventure",
//       originalPrice: 49999,
//       discountedPrice: 41999,
//       tag: "Bucket List",
//     },
//     {
//       name: "Delhi",
//       desc: "A historic capital showcasing Mughal monuments, bustling markets, and modern city vibes.",
//       image:
//         "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200",
//       package: "Delhi Heritage & Culture Trail",
//       originalPrice: 26999,
//       discountedPrice: 21999,
//       tag: "Historic Icon",
//     },
//     {
//       name: "Ayodhya, Uttar Pradesh",
//       desc: "A sacred spiritual destination deeply rooted in Indian mythology and cultural heritage.",
//       image:
//         "https://images.unsplash.com/photo-1702115416496-40a4d0c2d9ad?q=80&w=1200",
//       package: "Ayodhya Divine Pilgrimage Tour",
//       originalPrice: 23999,
//       discountedPrice: 18999,
//       tag: "Spiritual Journey",
//     },
//     {
//       name: "Bangalore, Karnataka",
//       desc: "India’s Silicon Valley with lush gardens, breweries, and pleasant weather year-round.",
//       image:
//         "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200",
//       package: "Bangalore Urban Explorer Getaway",
//       originalPrice: 25999,
//       discountedPrice: 20999,
//       tag: "City Break",
//     },
//     {
//       name: "Pune, Maharashtra",
//       desc: "A perfect blend of history, education hubs, hill views, and vibrant nightlife.",
//       image:
//         "https://images.unsplash.com/photo-1603349135288-1d7e8bb3b8e3?q=80&w=1200",
//       package: "Pune Culture & Hills Retreat",
//       originalPrice: 24999,
//       discountedPrice: 19999,
//       tag: "Weekend Favorite",
//     },
//     {
//       name: "Ahmedabad, Gujarat",
//       desc: "A UNESCO heritage city known for Sabarmati Ashram, architecture, and rich traditions.",
//       image:
//         "https://images.unsplash.com/photo-1622108545213-4f5b9f2f8d7b?q=80&w=1200",
//       package: "Ahmedabad Heritage Walk Tour",
//       originalPrice: 23999,
//       discountedPrice: 18999,
//       tag: "Cultural Gem",
//     },
//     {
//       name: "Agra, Uttar Pradesh",
//       desc: "Home to the iconic Taj Mahal, symbolizing eternal love and Mughal grandeur.",
//       image:
//         "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200",
//       package: "Agra Taj Mahal Golden Triangle Tour",
//       originalPrice: 27999,
//       discountedPrice: 22999,
//       tag: "World Wonder",
//     },
//     {
//       name: "Hyderabad, Telangana",
//       desc: "A royal city of Nizams famous for Charminar, pearls, and world-renowned biryani.",
//       image:
//         "https://images.unsplash.com/photo-1604856420421-8fd52b9b67f8?q=80&w=1200",
//       package: "Hyderabad Royal Nizam Experience",
//       originalPrice: 26999,
//       discountedPrice: 21999,
//       tag: "Food Lover’s Pick",
//     },
//     {
//       name: "Kutch, Gujarat",
//       desc: "A white desert famous for Rann Utsav, handicrafts, and vibrant cultural festivals.",
//       image:
//         "https://images.unsplash.com/photo-1601118964938-0c9e4a06a4cf?q=80&w=1200",
//       package: "Rann of Kutch Desert Festival Tour",
//       originalPrice: 33999,
//       discountedPrice: 27999,
//       tag: "Cultural Festival",
//     },
//     {
//       name: "Varanasi, Uttar Pradesh",
//       desc: "One of the world’s oldest living cities offering sacred ghats and spiritual enlightenment.",
//       image:
//         "https://images.unsplash.com/photo-1600172454524-40c93a8e8a24?q=80&w=1200",
//       package: "Varanasi Timeless Spiritual Journey",
//       originalPrice: 25999,
//       discountedPrice: 19999,
//       tag: "Spiritual Icon",
//     },
//     {
//       name: "Udaipur, Rajasthan",
//       desc: "The romantic City of Lakes known for palaces, heritage stays, and sunset views.",
//       image:
//         "https://images.unsplash.com/photo-1609921212029-bb5a28e2dcb1?q=80&w=1200",
//       package: "Udaipur Royal Lakes & Palaces Retreat",
//       originalPrice: 32999,
//       discountedPrice: 26999,
//       tag: "Royal Luxury",
//     },
//     {
//       name: "Rishikesh, Uttarakhand",
//       desc: "The yoga capital of the world offering river rafting, meditation, and spiritual calm.",
//       image:
//         "https://images.unsplash.com/photo-1585136917971-7a8d6b3bdbfd?q=80&w=1200",
//       package: "Rishikesh Yoga & Adventure Escape",
//       originalPrice: 28999,
//       discountedPrice: 22999,
//       tag: "Wellness Retreat",
//     },
//     {
//       name: "Shimla & Kufri, Himachal Pradesh",
//       desc: "Colonial hill stations offering snowfall, toy train rides, and scenic mountain views.",
//       image:
//         "https://images.unsplash.com/photo-1593182440959-9f7e47e7b7e2?q=80&w=1200",
//       package: "Shimla Kufri Snowy Hills Getaway",
//       originalPrice: 35999,
//       discountedPrice: 29999,
//       tag: "Hill Station",
//     },
//     {
//       name: "Darjeeling, West Bengal",
//       desc: "Tea gardens, Himalayan views, and the iconic toy train charm.",
//       image:
//         "https://images.unsplash.com/photo-1580974852861-c381510bc98d?q=80&w=1200",
//       package: "Darjeeling Tea & Mountain Trails",
//       originalPrice: 36999,
//       discountedPrice: 30999,
//       tag: "Scenic Escape",
//     },
//     {
//       name: "Andaman & Nicobar Islands",
//       desc: "Pristine beaches, crystal-clear waters, coral reefs, and tropical serenity.",
//       image:
//         "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200",
//       package: "Andaman Tropical Island Paradise",
//       originalPrice: 54999,
//       discountedPrice: 45999,
//       tag: "Island Luxury",
//     },
//     {
//       name: "Kaziranga National Park, Assam",
//       desc: "A UNESCO World Heritage site famous for one-horned rhinoceroses and wildlife safaris.",
//       image:
//         "https://images.unsplash.com/photo-1614699475490-47f0b64b9a6b?q=80&w=1200",
//       package: "Kaziranga Wildlife Safari Adventure",
//       originalPrice: 38999,
//       discountedPrice: 31999,
//       tag: "Wildlife Special",
//     },
//     {
//       name: "Mysuru, Karnataka",
//       desc: "A royal city known for Mysore Palace, yoga heritage, and Dasara celebrations.",
//       image:
//         "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=1200",
//       package: "Mysuru Royal Heritage Experience",
//       originalPrice: 25999,
//       discountedPrice: 20999,
//       tag: "Heritage City",
//     },
//     {
//       name: "Sikkim",
//       desc: "A serene Himalayan state with monasteries, alpine landscapes, and peaceful culture.",
//       image:
//         "https://images.unsplash.com/photo-1611078483046-9c8b6b6e7c53?q=80&w=1200",
//       package: "Sikkim Himalayan Serenity Tour",
//       originalPrice: 39999,
//       discountedPrice: 33999,
//       tag: "Hidden Gem",
//     },
//   ];

//   const ITINERARIES = [
//     {
//       id: 1,
//       title: "Royal Rajasthan Trail",
//       duration: "3 Days / 2 Nights",
//       route: "Jaipur → Jodhpur → Udaipur",
//       locations: ["Jaipur", "Jodhpur", "Udaipur"],
//       price: 42000,
//     //   image: Banner,
//       discountedPrice: 34999,
//       badge: "Best Deal",
//       type: "best",
//       combo: true,
//       days: [
//         "Arrival & Jaipur City Palace tour",
//         "Amber Fort, Jal Mahal & local bazaars",
//         "Jodhpur – Mehrangarh Fort & Blue City walk",
//       ],
//     },
//     {
//       id: 2,
//       title: "Spiritual Varanasi Escape",
//       duration: "3 Days / 2 Nights",
//       route: "Varanasi → Sarnath",
//       locations: ["Varanasi", "Sarnath"],
//       price: 18000,
//     //   image: Banner2,
//       discountedPrice: 14999,
//       badge: "Recommended",
//       type: "recommended",
//       combo: false,
//       days: [
//         "Arrival & evening Ganga Aarti",
//         "Sunrise boat ride & Kashi temple walk",
//         "Sarnath Buddhist circuit & departure",
//       ],
//     },
//   ];

  export const PACKAGE_DATA = [
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
    days: ["Arrival & Gateway of India visit",
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
    days: ["Arrival & beach relaxation",
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
    image:null,
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
    description:"A thrilling journey through the high-altitude landscapes of Ladakh, including visits to monasteries, lakes, and mountain passes.",
    image:null,
    duration: null,
    route: "Leh → Monasteries → Pangong Lake → Nubra Valley", 
    locations: ["Leh","Pangong Lake","Nubra Valley"],
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
    description:"A historic capital showcasing Mughal monuments, bustling markets, and modern city vibes.",
    image:null,
    duration: null,
    route: "Delhi → Red Fort → Qutub Minar → India Gate",
    locations: ["Delhi","Red Fort","Qutub Minar","India Gate"],
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
    description:"An exhilarating trek through the majestic Himalayas, offering breathtaking views and cultural experiences.",
    image:null,
    duration: null,
    route: "Manali → Trekking Routes → Mountain Passes", 
    locations: ["Manali","Trekking Routes","Mountain Passes"],
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
];

export default PACKAGE_DATA;
