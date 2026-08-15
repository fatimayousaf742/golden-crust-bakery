import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">&#127838;</span>
                <div>
                  <span className="logo-name">Golden Crust</span>
                  <span className="logo-tagline">Artisan Bakery</span>
                </div>
              </div>
              <p>
                Crafting moments of joy through our artisan baked goods since
                1999. Every product is a labor of love, made with the finest
                ingredients and time-honored techniques.
              </p>
              <div className="footer-food-avatars">
                <div className="food-avatar" title="Butter Croissant">
                  <img src="/images/butter-croissant.jfif" alt="Croissant" />
                </div>
                <div className="food-avatar" title="Berry Pie">
                  <img src="/images/berry-pie.jfif" alt="Pie" />
                </div>
                <div className="food-avatar" title="Cinnamon Roll">
                  <img src="/images/cinnamon-roll.jfif" alt="Cinnamon Roll" />
                </div>
                <div className="food-avatar" title="Chocolate Eclair">
                  <img src="/images/chocolate-eclairs.jfif" alt="Eclair" />
                </div>
                <div className="food-avatar" title="Fruit Tart">
                  <img src="/images/fruit-tart.jfif" alt="Fruit Tart" />
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  &#128247;
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  &#128248;
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  &#128038;
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  &#127909;
                </a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#categories">Our Menu</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Categories</h4>
              <ul>
                <li><a href="#categories">Cakes</a></li>
                <li><a href="#categories">Bread</a></li>
                <li><a href="#categories">Pastries</a></li>
                <li><a href="#categories">Cupcakes</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Newsletter</h4>
              <p>Subscribe for fresh updates, seasonal specials, and exclusive offers.</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email" required />
                <button type="submit" className="newsletter-btn">
                  &rarr;
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Golden Crust Bakery. All rights reserved.</p>
          <p>Baked with &#10084;&#65039; and a lot of flour.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
