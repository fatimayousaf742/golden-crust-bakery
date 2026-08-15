import './Hero.css';

const Hero = ({ onOrderClick }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-bg-images">
        <div className="bg-img bg-img-1"></div>
        <div className="bg-img bg-img-2"></div>
        <div className="bg-img bg-img-3"></div>
        <div className="bg-img bg-img-4"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-text">
          <span className="hero-badge">Welcome to Golden Crust</span>
          <h1 className="hero-title">
            Baked with <span className="highlight">Love</span>,
            <br />
            Served with <span className="highlight">Passion</span>
          </h1>
          <p className="hero-description">
            Discover the art of artisan baking. From golden-crusted breads to
            exquisite pastries, every bite tells a story of tradition,
            craftsmanship, and the finest ingredients.
          </p>
          <div className="hero-buttons">
            <a href="#categories" className="btn-primary">
              Explore Menu
            </a>
            <button className="btn-primary hero-order-btn" onClick={onOrderClick}>
              Order Now
            </button>
            <a href="#about" className="btn-secondary hero-btn-secondary">
              Our Story
            </a>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
