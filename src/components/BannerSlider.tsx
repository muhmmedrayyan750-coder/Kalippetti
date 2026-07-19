import { useState, useEffect, useCallback, useRef } from 'react';
import './BannerSlider.css';

interface BannerSlide {
    id: number;
    imageUrl: string;
    alt: string;
    link?: string;
}

const SLIDES: BannerSlide[] = [
    {
        id: 1,
        imageUrl: '/banner-football.png',
        alt: 'Football Combo Set – Complete Football Gear Only Rs. 2999',
        link: '#shop',
    },
    {
        id: 2,
        imageUrl: '/banner-sale.png',
        alt: 'Kalippetti – 50% Off on All Products',
        link: '#shop',
    },
];

const AUTO_PLAY_MS = 5000;

export default function BannerSlider() {
    const [current, setCurrent] = useState(0);
    const [animDir, setAnimDir] = useState<'left' | 'right'>('left');
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const goTo = useCallback(
        (index: number, dir: 'left' | 'right' = 'left') => {
            if (animating) return;
            setAnimDir(dir);
            setAnimating(true);
            setTimeout(() => {
                setCurrent((index + SLIDES.length) % SLIDES.length);
                setAnimating(false);
            }, 420);
        },
        [animating]
    );

    const next = useCallback(() => {
        goTo(current + 1, 'left');
    }, [current, goTo]);

    const prev = useCallback(() => {
        goTo(current - 1, 'right');
    }, [current, goTo]);

    // Auto-play
    useEffect(() => {
        timerRef.current = setTimeout(next, AUTO_PLAY_MS);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [current, next]);

    const slide = SLIDES[current];

    return (
        <section className="banner-slider" aria-label="Promotional Banners">
            <div className={`banner-track ${animating ? `banner-exit-${animDir}` : 'banner-enter'}`}>
                <a
                    href={slide.link || '#'}
                    onClick={(e) => e.preventDefault()}
                    className="banner-slide-link"
                    aria-label={slide.alt}
                >
                    <img
                        src={slide.imageUrl}
                        alt={slide.alt}
                        className="banner-image"
                        draggable={false}
                    />
                </a>
            </div>

            {/* Prev Arrow */}
            <button
                className="banner-arrow banner-arrow-prev"
                onClick={prev}
                aria-label="Previous banner"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {/* Next Arrow */}
            <button
                className="banner-arrow banner-arrow-next"
                onClick={next}
                aria-label="Next banner"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Dot Indicators */}
            <div className="banner-dots" role="tablist" aria-label="Banner slides">
                {SLIDES.map((s, i) => (
                    <button
                        key={s.id}
                        className={`banner-dot${i === current ? ' active' : ''}`}
                        onClick={() => goTo(i, i > current ? 'left' : 'right')}
                        role="tab"
                        aria-selected={i === current}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
