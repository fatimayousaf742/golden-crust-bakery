import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import './AuthPopup.css';

export default function Register({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', phone: '', birthDate: '', deliveryAddress: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        birthDate: form.birthDate || undefined,
        deliveryAddress: form.deliveryAddress || undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-popup">
      <div className="auth-header">
        <div className="auth-header-icon">🎂</div>
        <h3>Join Golden Crust</h3>
        <p>Create your account for a sweeter experience</p>
      </div>
      <div className="auth-body">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-row">
            <div className="form-group">
              <label htmlFor="reg-firstName">First Name *</label>
              <input
                id="reg-firstName"
                type="text"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-lastName">Last Name *</label>
              <input
                id="reg-lastName"
                type="text"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email *</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-row">
            <div className="form-group">
              <label htmlFor="reg-password">Password *</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirmPassword">Confirm *</label>
              <input
                id="reg-confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Phone</label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-birthDate">Birth Date (for birthday perks!)</label>
            <input
              id="reg-birthDate"
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-address">Delivery Address</label>
            <textarea
              id="reg-address"
              name="deliveryAddress"
              placeholder={'123 Bakery Lane, Sweet Town'}
              value={form.deliveryAddress}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin}>Sign In</button>
        </div>
        <button className="auth-back-btn" onClick={onClose}>
          &larr; Back to Home
        </button>
      </div>
    </div>
  );
}
