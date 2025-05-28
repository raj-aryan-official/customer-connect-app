import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './Home.css';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home-root">
      {/* Header */}
      <header className="header">
        <div className="header-title-group">
          <span className="header-title">Customer Connect</span>
          <span className="header-tagline">Bridging customers and shop owners</span>
        </div>
        <div className="header-buttons">
          {user ? (
            <>
              {user.role === 'customer' && <button className="btn-primary" onClick={() => navigate('/dashboard/customer')}>Dashboard</button>}
              {user.role === 'shopkeeper' && <button className="btn-primary" onClick={() => navigate('/dashboard/shopkeeper')}>Dashboard</button>}
              <button className="btn-primary" onClick={() => navigate('/profile')}>Profile</button>
              <button className="btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-accent" onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Local Shopping Connection, Simplified.</h1>
          <p className="hero-subtitle">Bridge the gap between you and your favorite local shops.
            Send your shopping list, get confirmation, and pick up ready-to-go orders.</p>
          <div className="hero-actions">
            {/* <Link to="/login?role=customer"><button className="btn-primary">I'm a Customer</button></Link>
            <Link to="/login?role=shopkeeper"><button className="btn-accent">I'm a Shop Owner</button></Link> */}

            <Link to="/register"><button className='Sign-in'>Sign up now</button></Link>
          </div>
        </div>
        <div className="hero-illustration">
          <img src="https://okcredit-blog-images-prod.storage.googleapis.com/2021/04/onlinegrocerystore1.jpg" alt="Shopping Interaction" className="hero-img" />
        </div>
      </section>

      {/* Overview Timeline */}
      <section className="timeline-section">
        <h2 className="timeline-title">How Customer Connect Works</h2>
        <div className="timeline-steps">
          {[
            { icon: '📝', label: 'Customer submits product list' },
            { icon: '🔍', label: 'Shop owner reviews availability/pricing' },
            { icon: '✅', label: 'Order confirmation sent' },
            { icon: '📦', label: 'Items packed & notification sent' },
            { icon: '💳', label: 'Payment upon collection' },
          ].map((step, idx) => (
            <div key={idx} className="timeline-step">
              <span className="timeline-icon">{step.icon}</span>
              <span className="timeline-label">{step.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-section">
        <h2 className="problem-title">The Challenges We Solve</h2>
        <div className="problem-columns">
          <div className="problem-box">
            <span className="problem-icon">😕</span>
            <h3 className="problem-heading">Customer Frustrations</h3>
            <ul className="problem-list">
              <li>Unavailable items</li>
              <li>Price surprises</li>
            </ul>
          </div>
          <div className="problem-box">
            <span className="problem-icon">🛒</span>
            <h3 className="problem-heading">Shop Owner Struggles</h3>
            <ul className="problem-list">
              <li>Managing requests efficiently</li>
            </ul>
          </div>
          <div className="problem-box">
            <span className="problem-icon">🔄</span>
            <h3 className="problem-heading">Process Issues</h3>
            <ul className="problem-list">
              <li>Order confirmation</li>
              <li>Payment streamlining</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Goals & Benefits */}
      <section className="benefit-section">
        <h2 className="benefit-title">Why Use Customer Connect?</h2>
        <div className="benefit-boxes">
          <div className="benefit-box">
            <span className="benefit-icon">⏰</span>
            <h4 className="benefit-heading">Save Time</h4>
            <p className="benefit-desc">Submit your list and avoid waiting in line.</p>
          </div>
          <div className="benefit-box">
            <span className="benefit-icon">💰</span>
            <h4 className="benefit-heading">Price Transparency</h4>
            <p className="benefit-desc">Know the price before you buy.</p>
          </div>
          <div className="benefit-box">
            <span className="benefit-icon">✔️</span>
            <h4 className="benefit-heading">Guaranteed Availability</h4>
            <p className="benefit-desc">Get confirmation before you visit.</p>
          </div>
          <div className="benefit-box">
            <span className="benefit-icon">📦</span>
            <h4 className="benefit-heading">Better Inventory Management</h4>
            <p className="benefit-desc">Shop owners can plan ahead.</p>
          </div>
          <div className="benefit-box">
            <span className="benefit-icon">😊</span>
            <h4 className="benefit-heading">Reduced In-Person Pressure</h4>
            <p className="benefit-desc">Less stress for shop owners and staff.</p>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="target-section">
        <div className="target-box">
          <span className="target-icon">👤</span>
          <h3 className="target-heading">For Customers</h3>
          <p className="target-desc">Individuals who want to preorder products and save time.</p>
        </div>
        <div className="target-box">
          <span className="target-icon">🏪</span>
          <h3 className="target-heading">For Shop Owners</h3>
          <p className="target-desc">Small business owners managing inventory and orders efficiently.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <p>Email: support@customerconnect.com</p>
            <p>Phone: +1 234 567 8901</p>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="footer-social-icon" /></a>
              <a href="#" aria-label="Twitter"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="footer-social-icon" /></a>
              <a href="#" aria-label="Instagram"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" className="footer-social-icon" /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Customer Connect. All rights reserved.</span>
          <span className="footer-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;