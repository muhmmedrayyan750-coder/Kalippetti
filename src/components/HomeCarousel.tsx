import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeCarouselProps {
    setActivePage: (page: string) => void;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ setActivePage }) => {
    const images = [
        { src: '/kids-banner.jpg', alt: "Kerala's Leading Kids Brand" },
        { src: '/football-banner.jpg', alt: 'All-in-One Football Kit' },
        { src: '/diapers-banner.png', alt: 'Diapers Sale Promotion' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const timerRef = useRef<any>(null);

    const startAutoPlay = () => {
        stopAutoPlay();
        timerRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // Shift every 4 seconds
    };

    const stopAutoPlay = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, []);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        stopAutoPlay();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        startAutoPlay();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        stopAutoPlay();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        startAutoPlay();
    };

    const handleDotClick = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        stopAutoPlay();
        setCurrentIndex(idx);
        startAutoPlay();
    };

    return (
        <div
            className="home-carousel-container"
            onClick={() => setActivePage('shop')}
        >
            {/* Slides wrap */}
            <div className="home-carousel-slides">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className={`home-carousel-slide ${idx === currentIndex ? 'active' : ''}`}
                        style={{
                            backgroundImage: `url(${img.src})`,
                            display: idx === currentIndex ? 'block' : 'none'
                        }}
                        role="img"
                        aria-label={img.alt}
                    />
                ))}
            </div>

            {/* Nav Controls */}
            <button
                className="carousel-nav-btn prev-btn"
                onClick={handlePrev}
                aria-label="Previous Slide"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                className="carousel-nav-btn next-btn"
                onClick={handleNext}
                aria-label="Next Slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicator dots */}
            <div className="carousel-indicators">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={(e) => handleDotClick(idx, e)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomeCarousel;
