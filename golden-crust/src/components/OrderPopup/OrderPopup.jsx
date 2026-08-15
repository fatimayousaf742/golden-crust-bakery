import { useEffect, useState } from 'react';
import { submitOrder } from '../../api';
import './OrderPopup.css';

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

const dietaryOptions = ['Nut-Free', 'Gluten-Free', 'Vegan', 'Dairy-Free', 'Egg-Free', 'Soy-Free', 'Organic'];
const occasionOptions = ['Birthday', 'Wedding', 'Anniversary', 'Corporate Event', 'Holiday', 'Just Because', 'Other'];
const hearAboutOptions = ['Social Media', 'Friend / Family', 'Google Search', 'Walk-in', 'Local Ad', 'Other'];
const paymentOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card (Pay on Arrival)' },
  { value: 'online', label: 'Online Payment' },
];
const timeSlots = [
  '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM',
];

const OrderPopup = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('idle');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [selectedDietary, setSelectedDietary] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      setDeliveryType('pickup');
      setSelectedDietary([]);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleDietary = (opt) => {
    setSelectedDietary((prev) =>
      prev.includes(opt) ? prev.filter((d) => d !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      category: form.category.value,
      item: form.item.value,
      quantity: parseInt(form.quantity.value) || 1,
      delivery_type: deliveryType,
      address: form.address?.value || '',
      city: form.city?.value || '',
      zip: form.zip?.value || '',
      preferred_date: form.preferred_date.value || null,
      preferred_time: form.preferred_time.value || '',
      payment_method: form.payment_method.value,
      dietary_preferences: selectedDietary.join(', '),
      occasion: form.occasion.value,
      hear_about: form.hear_about.value,
      instructions: form.instructions.value,
    };
    try {
      await submitOrder(data);
      setStatus('success');
      form.reset();
      setSelectedDietary([]);
      setTimeout(() => { setStatus('idle'); onClose(); }, 2000);
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="order-popup-overlay" onClick={onClose}>
      <div className="order-popup" onClick={(e) => e.stopPropagation()}>
        <div className="order-popup-header">
          <button className="order-popup-close" onClick={onClose}>&times;</button>
          <h3>Place Your Order</h3>
          <p>Freshly baked goods delivered to your door</p>
        </div>
        <div className="order-popup-body">
          <form className="order-popup-form" onSubmit={handleSubmit}>
            {/* Contact Info */}
            <div className="form-section-title">Contact Information</div>
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="name" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email Address" required />
              </div>
            </div>
            <div className="form-group">
              <input type="tel" name="phone" placeholder="Phone Number" required />
            </div>

            {/* Order Details */}
            <div className="form-section-title">Order Details</div>
            <div className="form-row">
              <div className="form-group">
                <select name="category" defaultValue="" required>
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input type="text" name="item" placeholder="Specific Item (e.g. Chocolate Cake)" />
              </div>
            </div>
            <div className="form-group">
              <input type="number" name="quantity" placeholder="Quantity" min="1" defaultValue="1" />
            </div>

            {/* Delivery Method */}
            <div className="form-section-title">Delivery Method</div>
            <div className="form-radio-group">
              <label className={`radio-label ${deliveryType === 'pickup' ? 'active' : ''}`}>
                <input type="radio" name="delivery_type" value="pickup" checked={deliveryType === 'pickup'} onChange={() => setDeliveryType('pickup')} />
                <span className="radio-content">
                  <span className="radio-icon">🏪</span>
                  <span>Pickup</span>
                </span>
              </label>
              <label className={`radio-label ${deliveryType === 'delivery' ? 'active' : ''}`}>
                <input type="radio" name="delivery_type" value="delivery" checked={deliveryType === 'delivery'} onChange={() => setDeliveryType('delivery')} />
                <span className="radio-content">
                  <span className="radio-icon">🚚</span>
                  <span>Home Delivery</span>
                </span>
              </label>
            </div>

            {deliveryType === 'delivery' && (
              <div className="delivery-address-fields">
                <div className="form-group">
                  <input type="text" name="address" placeholder="Street Address" required={deliveryType === 'delivery'} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" name="city" placeholder="City" required={deliveryType === 'delivery'} />
                  </div>
                  <div className="form-group">
                    <input type="text" name="zip" placeholder="ZIP Code" required={deliveryType === 'delivery'} />
                  </div>
                </div>
              </div>
            )}

            {/* Schedule */}
            <div className="form-section-title">Preferred Schedule</div>
            <div className="form-row">
              <div className="form-group">
                <input type="date" name="preferred_date" />
              </div>
              <div className="form-group">
                <select name="preferred_time" defaultValue="">
                  <option value="" disabled>Select Time Slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment */}
            <div className="form-section-title">Payment Method</div>
            <div className="form-group">
              <select name="payment_method" defaultValue="cash" required>
                {paymentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Dietary Preferences */}
            <div className="form-section-title">Dietary Preferences / Allergies</div>
            <div className="form-checkbox-group">
              {dietaryOptions.map((opt) => (
                <label key={opt} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedDietary.includes(opt)}
                    onChange={() => toggleDietary(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            {/* Occasion */}
            <div className="form-section-title">Occasion</div>
            <div className="form-group">
              <select name="occasion" defaultValue="">
                <option value="" disabled>Select Occasion (optional)</option>
                {occasionOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* How did you hear */}
            <div className="form-section-title">How Did You Hear About Us?</div>
            <div className="form-group">
              <select name="hear_about" defaultValue="">
                <option value="" disabled>Select (optional)</option>
                {hearAboutOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Instructions */}
            <div className="form-section-title">Special Instructions</div>
            <div className="form-group">
              <textarea name="instructions" placeholder="Any special requests..." rows="3"></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting...' : 'Place Order'}
            </button>
            {status === 'success' && <p className="form-success">Order placed successfully!</p>}
            {status === 'error' && <p className="form-error">Failed to place order. Try again.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;
