import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Destination = () => {
    const destinations = [
        { name: "Mumbai", description: "Explore the vibrant city of Mumbai with our Mumbai tour package, offering an unforgettable Mumbai Darshan experience. Dive into the bustling streets and witness iconic landmarks like the Gateway of India, Marine Drive, and Elephanta Caves. Immerse yourself in the rich culture at the Siddhivinayak Temple and Haji Ali Dargah. Indulge in the flavors of Mumbai with street food delights at Chowpatty Beach and explore the bustling markets of Colaba Causeway. From the historical treasures to the modern marvels, our Mumbai tour promises a captivating journey through the heart of India's financial capital, leaving you with cherished memories for a lifetime.", image: "https://t4.ftcdn.net/jpg/02/01/18/91/360_F_201189187_HAvNKbc5dBACc8Sl0sXVv8lVbwQua0ph.jpg", price: "$500" },
        { name: "Delhi", description: "Embark on an enriching journey through Delhi with our captivating Delhi tour package, highlighting the majestic Qutub Minar. Marvel at the towering monument, a UNESCO World Heritage Site, known for its intricate architecture and historical significance. Explore the vibrant streets of Old Delhi, discovering the bustling markets of Chandni Chowk and the grandeur of Red Fort.Visit Humayun's Tomb, a masterpiece of Mughal architecture, and experience the spiritual serenity of Jama Masjid. Delve into the rich heritage of India at the National Museum and witness the modernity of New Delhi with its iconic landmarks like India Gate and Lotus Temple.", image: "https://cdn.pixabay.com/photo/2017/03/19/08/01/qutub-minar-2155776_1280.jpg", price: "$600" },
        { name: "Ayodhya", description: "Embark on a spiritual journey to Ayodhya with our mesmerizing tour package, featuring a divine darshan at the revered Ram Mandir. Immerse yourself in the sacred atmosphere as you witness the magnificence of Lord Ram's abode, a symbol of devotion and faith. Explore the holy city's rich heritage with visits to historic sites such as Hanuman Garhi, Kanak Bhawan, and the scenic banks of the Sarayu River. Delve into the timeless tales of the Ramayana as you stroll through the ancient streets, soaking in the spiritual essence of Ayodhya. Our Ayodhya tour package offers an unforgettable experience filled with blessings and tranquility.", image: "https://images.2moons.ai/prompt/slices/3/watermarked/ayodhya-ram-temple-photograph-realistic-hyperealistic_SOzkQ.png", price: "$450" },
        { name: "Bangalore", description: "Experience the vibrant charm of Bangalore with our captivating tour package, offering a kaleidoscopic journey through the Garden City's enchanting sights. Explore the lush greenery of Lalbagh Botanical Garden and the tranquil ambiance of Cubbon Park, where nature flourishes amidst the bustling cityscape. Discover the architectural marvels of Vidhana Soudha and Tipu Sultan's Summer Palace, steeped in rich history and cultural heritage. Indulge in the vibrant culture and culinary delights at the bustling markets of Brigade Road and Commercial Street. From the iconic Bangalore Palace to the serene Ulsoor Lake.", image: "https://t3.ftcdn.net/jpg/04/36/67/54/360_F_436675446_jGWzkVDah3b6ONZxhhN13s6I4iFnjLGJ.jpg", price: "$550" },
        { name: "Pune", description: "Embark on a captivating journey through Pune with our enriching tour package, unveiling the city's rich history and vibrant culture. Explore the majestic Aga Khan Palace, a symbol of India's struggle for independence, and delve into the spiritual serenity of the serene Osho Ashram. Immerse yourself in the architectural marvels of Shaniwar Wada and the intricately designed Dagdusheth Halwai Ganpati Temple. Experience the bustling energy of Pune's vibrant streets at the bustling markets of MG Road and FC Road, where culinary delights and local handicrafts abound. From the lush greenery of Parvati Hill to the tranquil ambiance of Pashan Lake.", image: "https://t4.ftcdn.net/jpg/02/87/42/67/360_F_287426729_qbmatCI3Tc8XIQ5hjUJriYZOZlVUOnb4.jpg", price: "$480" },
        { name: "Ahmedabad", description: "Discover the vibrant city of Ahmedabad with our captivating tour package, showcasing the rich tapestry of culture, heritage, and architectural marvels. Immerse yourself in the grandeur of the Sabarmati Ashram, where the echoes of Mahatma Gandhi's teachings resonate through time. Explore the architectural splendor of the UNESCO World Heritage City with visits to the intricately carved Adalaj Stepwell and the iconic Sidi Saiyyed Mosque. Indulge in the flavors of Gujarat at the bustling Manek Chowk and relish the vibrant street art at Kala Ghoda. From the tranquil banks of the Sabarmati River to the bustling markets of Law Garden.", image: "https://images.unsplash.com/photo-1596201403089-d6cb29543f22?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWhtZWRhYmFkfGVufDB8fDB8fHww", price: "$520" },
        { name: "Agra", description: "Embark on a captivating journey to Agra with our enchanting tour package, offering a glimpse into the timeless beauty and grandeur of the Mughal era. Immerse yourself in the mesmerizing allure of the iconic Taj Mahal, a UNESCO World Heritage Site and one of the Seven Wonders of the World. Explore the majestic Agra Fort, steeped in rich history and architectural splendor, and marvel at the intricate craftsmanship of Itmad-ud-Daulah's Tomb. Indulge in the vibrant culture and flavors of Agra at the bustling markets of Sadar Bazaar and Kinari Bazaar. Our Agra tour package promises an unforgettable experience filled with history, heritage, and romance.", image: "https://cdn.pixabay.com/photo/2020/08/26/16/15/taj-mahal-5519945_640.jpg", price: "$700" },
        { name: "Hyderabad", description: "Embark on an enchanting journey to Hyderabad with our captivating tour package, immersing yourself in the rich history, culture, and architectural wonders of the City of Pearls. Explore the majestic Golconda Fort, a testament to the city's glorious past, and marvel at the intricate stone carvings of the Qutb Shahi Tombs. Indulge in the royal splendor of the Chowmahalla Palace and the enchanting charm of the Charminar. Experience the vibrant bazaars of Laad Bazaar and Sultan Bazaar, where centuries-old traditions blend seamlessly with modern-day hustle and bustle. Our Hyderabad tour package promises an unforgettable adventure through the heart of Telangana's capital city.", image: "https://cdn.britannica.com/77/22877-050-9EFB35D4/Charminar-city-Hyderabad-India-Telangana.jpg", price: "$580" },
        { name: "Kutch", description: "Embark on a mesmerizing journey to Kutch with our captivating tour package, offering a kaleidoscopic exploration of Gujarat's majestic desert landscape. Witness the ethereal beauty of the White Rann, a vast salt marsh that shimmers under the moonlight, creating a surreal spectacle. Explore the vibrant culture and heritage of the region at the Rann Utsav, a vibrant carnival of music, dance, and local craftsmanship. Delve into the ancient history of Kutch at the intricately carved Aina Mahal and the majestic Vijay Vilas Palace. From the enchanting Bhujodi village to the tranquil shores of Mandvi Beach, our Kutch tour package promises an unforgettable odyssey through this land of contrasts.", image: "https://www.gujarattourism.com/content/dam/gujrattourism/images/weekend-get-aways/great-rann-of-kutch/gallery/Great%20Rann%20Of%20Kutch%20(14).jpg", price: "$650" },
      ];
  const swiperParams = {
    breakpoints: {
      377 :{slidesPerView : 1},
      640: { slidesPerView: 1 },
      768: { slidesPerView: 1 },
      1024: { slidesPerView: 1 },
      1280: { slidesPerView: 1 },
    },
  };
  return (
    <section className='pb-20'>
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-8">Featured Destinations</h2>
      <Swiper {...swiperParams}
       slidesPerView={1}
       spaceBetween={16}
       pagination={{
         clickable: true,
       }}
       modules={[Pagination]}
       className="mySwiper"   
       >
        {destinations.map((destination, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col md:flex-row bg-neutral-950 rounded-lg shadow-md gap-4 p-4 mb-8">
              <div className="md:w-1/2 md:h-full">
                <img src={destination.image} alt={destination.name} className="w-full h-96 object-cover rounded-md mb-4 md:mb-0" />
              </div>
              <div className="md:w-1/2 md:ml-4">
                <h3 className="text-3xl text-center font-semibold mb-8">{destination.name}</h3>
                <p className="text-white text-lg mb-4">{destination.description}</p>
              <div className="flex gap-4">
                <button className="text-lg px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold">{destination.price}</button>
                <button className='text-lg px-4 rounded-lg font-semibold bg-green-600'><Link to ='/booking'>Book package</Link></button>
               </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </section>
  );
};

export default Destination;
