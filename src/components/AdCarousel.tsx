import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  bgColor: string;
  ctaText?: string;
  link?: string;
}

interface AdCarouselProps {
  ads: Advertisement[];
  setActivePage: (page: string) => void;
}

export const AdCarousel: React.FC<AdCarouselProps> = ({ ads, setActivePage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ads.length);
  };

  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <div className="ad-carousel">
      <div 
        className="carousel-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {ads.map((ad) => (
          <div 
            key={ad.id} 
            className="carousel-slide"
            style={{ backgroundColor: ad.bgColor || '#7026b9' }}
          >
            <div className="slide-content">
              <span className="slide-tag">Special Offer</span>
              <h2 className="slide-title">{ad.title}</h2>
              <p className="slide-subtitle">{ad.subtitle}</p>
              <button 
                onClick={() => setActivePage('shop')}
                className="slide-cta btn btn-secondary animate-pulse-soft"
              >
                {ad.ctaText || 'Shop Now 🧸'}
              </button>
            </div>
            <div className="slide-image-wrapper">
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="slide-image"
                onError={(e) => {
                  // Fallback in case of broken link
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80';
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {ads.length > 1 && (
        <>
          <button className="carousel-arrow prev" onClick={prevSlide} aria-label="Previous Slide">
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-arrow next" onClick={nextSlide} aria-label="Next Slide">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {ads.length > 1 && (
        <div className="carousel-indicators">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        .ad-carousel {
          position: relative;
          width: 100%;
          height: 380px;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          margin-bottom: 40px;
          border: 3px solid var(--border);
          box-shadow: var(--shadow-md);
        }
        .carousel-track {
          display: flex;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          width: 100%;
        }
        .carousel-slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40px 60px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .carousel-slide::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          top: -200px;
          right: -100px;
          pointer-events: none;
        }
        .slide-content {
          max-width: 50%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          z-index: 2;
        }
        .slide-tag {
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .slide-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        .slide-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
          font-weight: 500;
        }
        .slide-cta {
          margin-top: 10px;
        }
        .slide-image-wrapper {
          width: 40%;
          height: 90%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }
        .slide-image {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          border-radius: var(--border-radius-md);
          filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.2));
          animation: float-slide 6s ease-in-out infinite;
        }
        @keyframes float-slide {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 10;
          backdrop-filter: blur(4px);
          transition: var(--transition-bouncy);
        }
        .carousel-arrow:hover {
          background: white;
          color: var(--neutral-dark);
          transform: translateY(-50%) scale(1.1);
        }
        .carousel-arrow.prev {
          left: 20px;
        }
        .carousel-arrow.next {
          right: 20px;
        }
        .carousel-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        .indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: var(--transition-smooth);
        }
        .indicator-dot.active {
          background: white;
          transform: scale(1.3);
          width: 20px;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .ad-carousel {
            height: 480px;
          }
          .carousel-slide {
            flex-direction: column-reverse;
            justify-content: center;
            padding: 30px;
            text-align: center;
          }
          .slide-content {
            max-width: 100%;
            align-items: center;
          }
          .slide-title {
            font-size: 1.8rem;
          }
          .slide-subtitle {
            font-size: 1rem;
          }
          .slide-image-wrapper {
            width: 100%;
            height: 45%;
            margin-bottom: 20px;
          }
          .carousel-arrow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
export default AdCarousel;
