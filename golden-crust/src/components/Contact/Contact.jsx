import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { submitContact } from '../../api';
import './Contact.css';

const Contact = () => {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      subject: form.subject.value,
      message: form.message.value,
    };
    try {
      await submitContact(data);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <span>Get in Touch</span>
          <h2>Contact Us</h2>
          <p>
            Have a question, special order, or just want to say hello?
            We'd love to hear from you!
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-card contact-card-visit">
              <div className="contact-icon"><MapPin size={32} strokeWidth={1.5} /></div>
              <h4>Visit Us</h4>
              <p>123 Baker Street, Bakersville<br />New York, NY 10001</p>
            </div>
            <div className="contact-card contact-card-call">
              <div className="contact-icon"><Phone size={32} strokeWidth={1.5} /></div>
              <h4>Call Us</h4>
              <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
            </div>
            <div className="contact-card contact-card-email">
              <div className="contact-icon"><Mail size={32} strokeWidth={1.5} /></div>
              <h4>Email Us</h4>
              <p>hello@goldencrust.com<br />orders@goldencrust.com</p>
            </div>
            <div className="contact-card contact-card-hours">
              <div className="contact-icon"><Clock size={32} strokeWidth={1.5} /></div>
              <h4>Hours</h4>
              <p>Mon - Fri: 6:00 AM - 8:00 PM<br />Sat - Sun: 7:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Full Name</label>
                  <input type="text" id="contact-name" name="name" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input type="email" id="contact-email" name="email" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-phone">Phone</label>
                  <input type="tel" id="contact-phone" name="phone" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <select id="contact-subject" name="subject" defaultValue="" required>
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="order">Custom Order</option>
                    <option value="catering">Catering Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  placeholder="Tell us about your order or inquiry..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
              {status === 'success' && <p className="form-success">Message sent successfully!</p>}
              {status === 'error' && <p className="form-error">Failed to send message. Try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
