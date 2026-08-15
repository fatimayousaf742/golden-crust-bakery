import { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Carousel from './components/Carousel/Carousel';
import Categories from './components/Categories/Categories';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import OrderPopup from './components/OrderPopup/OrderPopup';
import DeliveryPopup from './components/DeliveryPopup/DeliveryPopup';
import AuthPage from './components/AuthPopup/AuthPage';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [authView, setAuthView] = useState('login');

  const handleLoginClick = () => {
    setCurrentPage('auth');
    setAuthView('login');
  };

  const handleCloseAuth = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'auth') {
    return (
      <AuthProvider>
        <AuthPage
          authView={authView}
          onClose={handleCloseAuth}
          onSwitchToLogin={() => setAuthView('login')}
          onSwitchToRegister={() => setAuthView('register')}
        />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="App">
        <Navbar
          onOrderClick={() => setIsOrderOpen(true)}
          onDeliveryClick={() => setIsDeliveryOpen(true)}
          onLoginClick={handleLoginClick}
        />
        <Hero onOrderClick={() => setIsOrderOpen(true)} />
        <Carousel />
        <Categories />
        <About />
        <Contact />
        <Footer />
        <OrderPopup isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
        <DeliveryPopup isOpen={isDeliveryOpen} onClose={() => setIsDeliveryOpen(false)} />
        <Chatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
