import { useEffect, useState } from 'react';
import { submitDelivery } from '../../api';
import './DeliveryPopup.css';

const categories = [
  { emoji: '🎂', name: 'Cakes' },
  { emoji: '🍕', name: 'Pizzas' },
  { emoji: '🍞', name: 'Bread' },
  { emoji: '🧁', name: 'Cupcakes' },
  { emoji: '🍬', name: 'Sweets' },
  { emoji: '🥐', name: 'Pastries' },
  { emoji: '🥧', name: 'Pies' },
  { emoji: '🍪', name: 'Cookies' },
];

const timeSlots = [
  { value: 'morning', emoji: '🌅', label: 'Morning (8:00 AM - 12:00 PM)' },
  { value: 'afternoon', emoji: '☀️', label: 'Afternoon (12:00 PM - 4:00 PM)' },
  { value: 'evening', emoji: '🌆', label: 'Evening (4:00 PM - 8:00 PM)' },
];

const DeliveryPopup = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('idle');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      setSelectedTime('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.target;
    const data = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
      city: form.city.value,
      zip: form.zip.value,
      category: form.category.value,
      date: form.date.value,
      time: selectedTime,
      instructions: form.instructions.value,
    };
    try {
      await submitDelivery(data);
      setStatus('success');
      form.reset();
      setSelectedTime('');
      setTimeout(() => { setStatus('idle'); onClose(); }, 2000);
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delivery-popup-overlay" onClick={onClose}>
      <div className="delivery-popup" onClick={(e) => e.stopPropagation()}>
        <div className="delivery-popup-header">
          <button className="delivery-popup-close" onClick={onClose}>&times;</button>
          <div className="delivery-header-icon">🚚</div>
          <h3>Home Delivery</h3>
          <p>Freshly baked, delivered warm to your door</p>
        </div>
        <div className="delivery-popup-body">
          <form className="delivery-popup-form" onSubmit={handleSubmit}>
            {/* Contact */}
            <div className="form-section-title">Contact Information</div>
            <div className="form-card">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="delivery-name">
                    <span className="field-icon">👤</span> Full Name
                  </label>
                  <input type="text" id="delivery-name" name="name" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label htmlFor="delivery-phone">
                    <span className="field-icon">📞</span> Phone Number
                  </label>
                  <input type="tel" id="delivery-phone" name="phone" placeholder="+1 (555) 000-0000" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="delivery-email">
                  <span className="field-icon">✉️</span> Email Address
                </label>
                <input type="email" id="delivery-email" name="email" placeholder="john@example.com" required />
              </div>
            </div>

            {/* Address */}
            <div className="form-section-title">Delivery Address</div>
            <div className="form-card">
              <div className="form-group">
                <label htmlFor="delivery-address">
                  <span className="field-icon">🏠</span> Street Address
                </label>
                <input type="text" id="delivery-address" name="address" placeholder="123 Main St, Apt 4B" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="delivery-city">
                    <span className="field-icon">🏙️</span> City
                  </label>
                  <input type="text" id="delivery-city" name="city" placeholder="New York" required />
                </div>
                <div className="form-group">
                  <label htmlFor="delivery-zip">
                    <span className="field-icon">📍</span> ZIP Code
                  </label>
                  <input type="text" id="delivery-zip" name="zip" placeholder="10001" required />
                </div>
              </div>
            </div>

            {/* Order */}
            <div className="form-section-title">Order Details</div>
            <div className="form-card">
              <div className="form-group">
                <label htmlFor="delivery-category">
                  <span className="field-icon">🍽️</span> Category
                </label>
                <select id="delivery-category" name="category" defaultValue="" required>
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="delivery-date">
                    <span className="field-icon">📅</span> Delivery Date
                  </label>
                  <input type="date" id="delivery-date" name="date" required />
                </div>
                <div className="form-group">
                  <label htmlFor="delivery-quantity">
                    <span className="field-icon">🔢</span> Quantity
                  </label>
                  <input type="number" id="delivery-quantity" name="quantity" placeholder="1" min="1" defaultValue="1" />
                </div>
              </div>
            </div>

            {/* Time - styled as radio cards */}
            <div className="form-section-title">Preferred Time Slot</div>
            <div className="time-slot-group">
              {timeSlots.map((slot) => (
                <label
                  key={slot.value}
                  className={`time-slot-card ${selectedTime === slot.value ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="time"
                    value={slot.value}
                    checked={selectedTime === slot.value}
                    onChange={() => setSelectedTime(slot.value)}
                    required
                  />
                  <span className="time-slot-emoji">{slot.emoji}</span>
                  <span className="time-slot-label">{slot.label}</span>
                </label>
              ))}
            </div>

            {/* Instructions */}
            <div className="form-section-title">Special Instructions</div>
            <div className="form-card">
              <div className="form-group">
                <label htmlFor="delivery-instructions">
                  <span className="field-icon">💬</span> Notes
                </label>
                <textarea
                  id="delivery-instructions"
                  name="instructions"
                  placeholder="Any special requests, allergies, or delivery notes..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <span className="btn-loading">⏳ Scheduling...</span>
              ) : (
                <span className="btn-content">🚚 Schedule Delivery</span>
              )}
            </button>
            {status === 'success' && <p className="form-success">✅ Delivery scheduled successfully!</p>}
            {status === 'error' && <p className="form-error">Failed to schedule delivery. Try again.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPopup;
