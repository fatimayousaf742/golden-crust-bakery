import { useState } from 'react';
import { categoryData } from '../../data/categoryData';
import CategoryDetail from '../CategoryDetail/CategoryDetail';
import './Categories.css';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleClose = () => {
    setSelectedCategory(null);
  };

  return (
    <section id="categories" className="categories">
      <div className="container">
        <div className="section-title">
          <span>Our Specialties</span>
          <h2>Baked to Perfection</h2>
          <p>
            Explore our wide range of artisan baked goods, crafted with love
            using traditional recipes and the finest ingredients
          </p>
        </div>

        <div className="categories-grid">
          {categoryData.map((category, index) => (
            <div
              key={category.name}
              className="category-card"
              style={{ '--delay': `${index * 0.08}s` }}
              onClick={() => handleCategoryClick(category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category);
                }
              }}
            >
              <div
                className="category-image"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div
                  className="category-image-overlay"
                  style={category.name === 'Pastries' ? { backgroundImage: 'url(/images/pastries.jfif)' } : {}}
                >
                  <span className="category-emoji">{category.emoji}</span>
                </div>
              </div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <ul className="category-items">
                  {category.items.map((item) => (
                    <li key={item.name}>{item.name}</li>
                  ))}
                </ul>
                <span className="category-link">
                  View {category.items.length} Items &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <CategoryDetail category={selectedCategory} onClose={handleClose} />
      )}
    </section>
  );
};

export default Categories;
