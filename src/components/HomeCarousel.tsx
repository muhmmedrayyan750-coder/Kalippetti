import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeCarouselProps {
    setActivePage: (page: string) => void;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ setActivePage }) => {
    const images = [
        { src: '/kids-banner.jpg', alt: "Kerala's Leading Kids Brand" },
        { src: '/football-banner.jpg', alt: 'All-in-One Football Kit' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopAutoPlay = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, []);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        stopAutoPlay();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        startAutoPlay();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        stopAutoPlay();
        setCurrentIndex((prev) => (prev + 1) % images.length);
        startAutoPlay();
    };

    const handleDotClick = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        stopAutoPlay();
        setCurrentIndex(idx);
        startAutoPlay();
    };

    return (
        <div className="home-carousel-wrapper">
            {/* Left Arrow — outside the image, firstcry-style */}
            <button
                className="carousel-arrow-btn carousel-arrow-left"
                onClick={handlePrev}
                aria-label="Previous Slide"
            >
                <ChevronLeft size={30} strokeWidth={2.5} />
            </button>

            {/* Banner Track */}
            <div
                className="home-carousel-track"
                onClick={() => setActivePage('shop')}
            >
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`home-carousel-slide${idx === currentIndex ? ' active' : ''}`}
                        style={{ backgroundImage: `url(${img.src})` }}
                        role="img"
                        aria-label={img.alt}
                    />
                ))}

                {/* Dot Indicators */}
                <div className="carousel-indicators">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`carousel-dot${idx === currentIndex ? ' active' : ''}`}
                            onClick={(e) => handleDotClick(idx, e)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Arrow — outside the image, firstcry-style */}
            <button
                className="carousel-arrow-btn carousel-arrow-right"
                onClick={handleNext}
                aria-label="Next Slide"
            >
                <ChevronRight size={30} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default HomeCarousel;
