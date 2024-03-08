import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      country: 'USA',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam, libero nec fermentum sollicitudin.'
    },
    {
      id: 2,
      name: 'Alice Smith',
      country: 'UK',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      review: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    },
    {
      id: 3,
      name: 'Juan Perez',
      country: 'Spain',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      review: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.'
    },
    {
        id: 4,
        name: 'Juan Perez',
        country: 'Spain',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        review: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.'
      },
      {
        id: 5,
        name: 'Juan Perez',
        country: 'Spain',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        review: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.'
      },
      {
        id: 6,
        name: 'Juan Perez',
        country: 'Spain',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        review: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.'
      },
  ];
  const swiperParams = {
    breakpoints: {
      377 :{slidesPerView : 1},
      640: {  slidesPerView: 1 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 3},
    },
  };

  return (
    <div className="py-20">
    <div className="container max-w-7xl px-4 mx-auto">
      <h2 className="text-4xl font-semibold text-center mb-8">Customer Reviews</h2>
      <div>
            <Swiper {...swiperParams}
            spaceBetween={16}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"   
        >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {reviews.map(review => (
            <SwiperSlide className='mb-12'>
            <div key={review.id} className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
             <div className="flex flex-col mb-4 items-center">
               <img src={review.image} alt={review.name} className="w-28 h-28 object-cover rounded-full mr-4" />
               <div>
                <h3 className="text-lg text-gray-500 font-semibold">{review.name}</h3>
                <p className="text-gray-500 text-center">{review.country}</p>
               </div>
                </div>
               <blockquote className="text-gray-600 italic">{review.review}</blockquote>
               </div>
            </SwiperSlide>
        ))}
        </div>
        </Swiper>
      </div>
    </div>
    </div>
  );
};

export default Reviews;
