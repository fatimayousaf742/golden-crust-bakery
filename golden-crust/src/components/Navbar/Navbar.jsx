import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import './Navbar.css';

const Navbar = ({ onOrderClick, onDeliveryClick, onLoginClick }) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Categories', href: '#categories' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          <span className="logo-icon">&#127838;</span>
          <div className="logo-text">
            <span className="logo-name">Golden Crust</span>
            <span className="logo-tagline">Artisan Bakery</span>
          </div>
        </a>

        <div className={`navbar-links ${isMobileOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {user ? (
            <>
              <span className="nav-link nav-user-greeting">
                Hi, {user.first_name}
              </span>
              <button className="nav-cta nav-cta-secondary" onClick={() => { logout(); setIsMobileOpen(false); }}>
                Sign Out
              </button>
            </>
          ) : (
            <button className="nav-link nav-auth-btn" onClick={() => { onLoginClick(); setIsMobileOpen(false); }}>
              Sign In
            </button>
          )}
          <button className="nav-cta nav-cta-secondary" onClick={() => { onDeliveryClick(); setIsMobileOpen(false); }}>
            Home Delivery
          </button>
          <button className="nav-cta" onClick={() => { onOrderClick(); setIsMobileOpen(false); }}>
            Order Now
          </button>
        </div>

        <button
          className={`hamburger ${isMobileOpen ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
