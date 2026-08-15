import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import './AuthPopup.css';

export default function Login({ onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const [method, setMethod] = useState('email');
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const identifier = method === 'email' ? form.email : form.phone;
    if (!identifier || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await login(identifier, form.password);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-popup">
      <div className="auth-header">
        <div className="auth-header-icon">🥖</div>
        <h3>Welcome Back</h3>
        <p>Sign in to your Golden Crust account</p>
      </div>

      <div className="auth-body">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${method === 'email' ? 'active' : ''}`}
            onClick={() => { setMethod('email'); setError(''); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Email
          </button>
          <button
            className={`auth-tab ${method === 'phone' ? 'active' : ''}`}
            onClick={() => { setMethod('phone'); setError(''); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Phone
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="auth-error">{error}</div>}

          {method === 'email' ? (
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={error && !form.email ? 'input-error' : ''}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="login-phone">Phone Number</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input
                  id="login-phone"
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className={error && !form.phone ? 'input-error' : ''}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={error && !form.password ? 'input-error' : ''}
                required
              />
            </div>
          </div>

          <div className="auth-options-row">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <button type="button" className="auth-forgot-link">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span className="auth-divider-line"></span>
          <span className="auth-divider-text">or continue with</span>
          <span className="auth-divider-line"></span>
        </div>

        <div className="auth-social">
          <button className="auth-social-btn auth-social-google">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Google
          </button>
          <button className="auth-social-btn auth-social-facebook">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#1877F2" d="M24 2C11.85 2 2 11.85 2 24c0 10.99 8.04 20.1 18.57 21.76V30.33h-5.59V24h5.59v-4.84c0-5.52 3.29-8.57 8.32-8.57 2.41 0 4.93.43 4.93.43v5.42h-2.78c-2.74 0-3.59 1.7-3.59 3.44V24h6.11l-.98 6.33h-5.13v15.43C37.96 44.1 46 34.99 46 24 46 11.85 36.15 2 24 2z"/>
              <path fill="#fff" d="M31.06 30.33 32 24h-6.11v-4.13c0-1.74.85-3.44 3.59-3.44h2.78v-5.42s-2.52-.43-4.93-.43c-5.03 0-8.32 3.05-8.32 8.57V24h-5.59v6.33h5.59v15.43c1.13.17 2.28.24 3.46.24s2.33-.08 3.46-.24V30.33h5.13z"/>
            </svg>
            Facebook
          </button>
        </div>

        <button className="auth-back-btn" onClick={onClose}>
          &larr; Back to Home
        </button>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <button onClick={onSwitchToRegister}>Create Account</button>
        </div>
      </div>
    </div>
  );
}
