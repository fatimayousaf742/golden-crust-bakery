import { useEffect } from 'react';
import './CategoryDetail.css';

const CategoryDetail = ({ category, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="detail-overlay" onClick={handleOverlayClick}>
      <div className="detail-modal">
        <button className="detail-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div
          className="detail-hero"
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <div className="detail-hero-overlay">
            <span className="detail-emoji">{category.emoji}</span>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        </div>

        <div className="detail-grid">
          {category.items.map((item, index) => (
            <div
              key={item.name}
              className="detail-card"
              style={{ '--delay': `${index * 0.06}s` }}
            >
              <div className="detail-card-image">
                <img src={item.image} alt={item.name} />
                {item.badge && (
                  <span className="detail-badge">{item.badge}</span>
                )}
              </div>
              <div className="detail-card-content">
                <div className="detail-card-header">
                  <h3>{item.name}</h3>
                  <span className="detail-price">{item.price}</span>
                </div>
                <p>{item.description}</p>
                <div className="detail-card-footer">
                  <a href="#contact" className="detail-order-btn" onClick={onClose}>
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
