"use client";
import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const optimizeImageUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`;
};

const ImagesCarousel = ({ array }) => {
    const prevButtonRef = useRef(null)
    const nextButtonRef = useRef(null)
    const swiperRef = useRef(null)

    useEffect(() => {
        if (swiperRef.current && prevButtonRef.current && nextButtonRef.current) {
            swiperRef.current.params.navigation.prevEl = prevButtonRef.current
            swiperRef.current.params.navigation.nextEl = nextButtonRef.current
            swiperRef.current.navigation.init()
            swiperRef.current.navigation.update()
        }
    }, [array])

    return (
        <div className="relative w-full h-52">
            {array.length > 0 ? (
                <>
                    <Swiper
                        key={array.length}
                        modules={[Navigation, Pagination, Autoplay]}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        className="w-full h-full"
                    >
                        {array.map((item, i) => (
                            <SwiperSlide key={`${item.id}-${i}`}>
                                <img
                                    src={optimizeImageUrl(item.image)}
                                    alt="carousel"
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Nav Buttons */}
                    <button
                        ref={prevButtonRef}
                        className="custom-prev absolute top-1/2 left-3 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all focus:outline-none focus:ring-4 focus:ring-white dark:bg-gray-800/30 dark:hover:bg-gray-800/60 dark:focus:ring-gray-800/70"
                        aria-label="Previous"
                    >
                        <FaChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        ref={nextButtonRef}
                        className="custom-next absolute top-1/2 right-3 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all focus:outline-none focus:ring-4 focus:ring-white dark:bg-gray-800/30 dark:hover:bg-gray-800/60 dark:focus:ring-gray-800/70"
                        aria-label="Next"
                    >
                        <FaChevronRight className="w-5 h-5" />
                    </button>
                </>
            ) : (
                <div className="bg-[#343452] w-full h-full animate-pulse"></div>
            )}
        </div>
    )
};

export default ImagesCarousel;
