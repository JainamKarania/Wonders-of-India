import React from 'react';
import { Agra ,  Ahmedabad ,Ayodhya ,About, Bangalore , Banner , Banner2 , Banner3 , Delhi , Hyderabad , Mumbai , Kutch , Pune , Tirupati } from "../assets/index"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const DestinationPackages = () => {
  const destinations = [
    { name: "Mumbai", description: "Explore the bustling city life and iconic landmarks of Mumbai.", image: {Mumbai}, price: "$500" },
    { name: "Delhi", description: "Discover the rich history and cultural heritage of Delhi.", image: "/images/delhi.jpg", price: "$600" },
    { name: "Ayodhya", description: "Visit the holy city of Ayodhya and explore its spiritual significance.", image: "/images/ayodhya.jpg", price: "$450" },
    { name: "Bangalore", description: "Experience the vibrant culture and modern amenities of Bangalore.", image: "/images/bangalore.jpg", price: "$550" },
    { name: "Pune", description: "Explore the cultural capital of Maharashtra with its rich history and scenic beauty.", image: "/images/pune.jpg", price: "$480" },
    { name: "Ahmedabad", description: "Discover the historical landmarks and delicious cuisine of Ahmedabad.", image: "/images/ahmedabad.jpg", price: "$520" },
    { name: "Agra", description: "Witness the breathtaking beauty of the Taj Mahal and other architectural wonders in Agra.", image: "/images/agra.jpg", price: "$700" },
    { name: "Hyderabad", description: "Explore the blend of tradition and modernity in Hyderabad, known as the City of Pearls.", image: "/images/hyderabad.jpg", price: "$580" },
    { name: "Kutch", description: "Experience the cultural extravaganza of the Rann of Kutch and its vibrant festivals.", image: "/images/kutch.jpg", price: "$650" },
  ];

  const swiperParams = {
    breakpoints: {
      377 :{slidesPerView : 1},
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 3 },
    },
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl text-center font-bold mb-12 text-black">Destination Packages</h2>
        <div className="">
        <Swiper {...swiperParams}
        slidesPerView={3}
        spaceBetween={16}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"   
        >
          {destinations.map((destination, index) => (
            <SwiperSlide key={index} className='mb-12'>
              <div className="bg-black p-6 rounded-lg shadow-md">
                <img src={destination.image} alt={destination.name} className="w-full h-48 object-cover mb-4 rounded-md" />
                <h3 className="text-xl text-white font-bold mb-2">{destination.name}</h3>
                <p className="text-white mb-4">{destination.description}</p>
                <p className="text-lg text-white font-semibold mb-4">{destination.price}</p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">View Package</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
    </div>
  );
};

export default DestinationPackages;
