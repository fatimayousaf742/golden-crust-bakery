import Login from './Login';
import Register from './Register';
import './AuthPopup.css';

export default function AuthPage({ authView, onClose, onSwitchToLogin, onSwitchToRegister }) {
  return (
    <div className="auth-page">
      <div className="auth-page-container">
        <div className="auth-page-image" />
        <div className="auth-page-form">
          {authView === 'login' ? (
            <Login onClose={onClose} onSwitchToRegister={onSwitchToRegister} />
          ) : (
            <Register onClose={onClose} onSwitchToLogin={onSwitchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
}
