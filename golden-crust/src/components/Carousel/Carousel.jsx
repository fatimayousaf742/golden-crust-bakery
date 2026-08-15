import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const images = [
  '/images/1.jfif',
  '/images/2.jfif',
  '/images/11.jfif',
  '/images/5.jfif',
  '/images/6.jfif',
  '/images/7.jfif',
  '/images/8.jfif',
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <div className="carousel-track">
          {images.map((src, index) => (
            <div
              key={src}
              className={`carousel-slide ${index === current ? 'active' : ''}`}
            >
              <img src={src} alt={`Bakery gallery ${index + 1}`} />
            </div>
          ))}
        </div>

        <button className="carousel-btn carousel-btn-prev" onClick={prev}>
          <ChevronLeft size={24} />
        </button>
        <button className="carousel-btn carousel-btn-next" onClick={next}>
          <ChevronRight size={24} />
        </button>

        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
