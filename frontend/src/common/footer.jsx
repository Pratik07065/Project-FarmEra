import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .fe-footer {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(160deg, #0d2b1a 0%, #1b4332 60%, #0f3624 100%);
    color: rgba(255,255,255,0.82);
    padding: 3.5rem 0 0;
    margin-top: auto;
    position: relative;
    overflow: hidden;
  }

  /* Subtle bg pattern */
  .fe-footer::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 15% 20%, rgba(82,183,136,0.06) 0%, transparent 50%),
      radial-gradient(circle at 85% 80%, rgba(82,183,136,0.06) 0%, transparent 50%);
    pointer-events: none;
  }

  .fe-footer-inner { position: relative; z-index: 1; }

  /* Brand col */
  .fe-footer-brand {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .fe-footer-brand-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 4px 14px rgba(82,183,136,0.3);
  }
  .fe-footer-brand-name {
    font-size: 1.3rem; font-weight: 900; color: #fff; letter-spacing: -0.3px;
  }
  .fe-footer-tagline {
    font-size: 0.84rem; color: rgba(255,255,255,0.55);
    font-weight: 600; line-height: 1.6; max-width: 260px;
    margin-bottom: 18px;
  }

  /* Stats chips in footer */
  .fe-footer-stat-row {
    display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;
  }
  .fe-footer-stat {
    background: rgba(82,183,136,0.1);
    border: 1px solid rgba(82,183,136,0.2);
    border-radius: 10px; padding: 6px 12px;
    font-size: 0.78rem; font-weight: 700;
    color: #95d5b2;
  }

  /* Column headings */
  .fe-footer-heading {
    font-size: 0.78rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #52b788; margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(82,183,136,0.2);
  }

  /* Links */
  .fe-footer-link {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.86rem; font-weight: 600;
    color: rgba(255,255,255,0.65) !important;
    text-decoration: none !important;
    padding: 4px 0;
    transition: color 0.2s, transform 0.2s;
  }
  .fe-footer-link:hover {
    color: #95d5b2 !important;
    transform: translateX(4px);
  }

  /* Tech stack tags */
  .fe-tech-tag {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 4px 10px;
    font-size: 0.76rem; font-weight: 700;
    color: rgba(255,255,255,0.6);
    margin: 3px 3px 3px 0;
    transition: all 0.2s;
  }
  .fe-tech-tag:hover {
    background: rgba(82,183,136,0.15);
    border-color: rgba(82,183,136,0.3);
    color: #95d5b2;
  }

  /* Contact row */
  .fe-footer-contact-item {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 0.84rem; color: rgba(255,255,255,0.6);
    font-weight: 600; margin-bottom: 8px;
  }
  .fe-footer-contact-item span:first-child { font-size: 0.9rem; margin-top: 1px; flex-shrink: 0; }

  /* Divider */
  .fe-footer-divider {
    border: none; border-top: 1px solid rgba(255,255,255,0.08);
    margin: 2.5rem 0 0;
  }

  /* Bottom bar */
  .fe-footer-bottom {
    padding: 16px 0;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
  }
  .fe-footer-copy {
    font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.4);
  }
  .fe-footer-copy strong { color: rgba(255,255,255,0.65); }
  .fe-footer-made {
    font-size: 0.78rem; font-weight: 700;
    color: rgba(255,255,255,0.35);
    display: flex; align-items: center; gap: 4px;
  }
  .fe-footer-made span { color: #f87171; }
`;

const QUICK_LINKS = [
  { to: '/',                 icon: '🏠', label: 'Home' },
  { to: '/yield-prediction', icon: '🌾', label: 'Yield Predictor' },
  { to: '/market-rate',      icon: '📈', label: 'Live Market Rate' },
  { to: '/rate-predictor',   icon: '💰', label: 'Price Forecasting' },
  { to: '/disease-prediction', icon: '🍃', label: 'Disease Predictor' },
  { to: '/chatbot',          icon: '🤖', label: 'AI Chatbot' },
  { to: '/market',           icon: '🏪', label: 'Marketplace' },
];

const TECH_STACK = [
  '⚛️ React.js', '🐍 Flask', '🍃 MongoDB',
  '🌲 Random Forest', '🚀 XGBoost', '🔬 MobileNet-V2',
  '🤖 Gemini AI', '📊 data.gov.in',
];

const Footer = () => {
  React.useEffect(() => {
    if (!document.getElementById('fe-footer-styles')) {
      const tag = document.createElement('style');
      tag.id = 'fe-footer-styles';
      tag.textContent = FOOTER_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <footer className="fe-footer">
      <div className="fe-footer-inner">
        <Container>
          <Row className="g-4 pb-2">

            {/* Brand col */}
            <Col lg={4} md={6}>
              <div className="fe-footer-brand">
                <div className="fe-footer-brand-icon">🌾</div>
                <span className="fe-footer-brand-name">FarmEra</span>
              </div>
              <p className="fe-footer-tagline">
                AI & ML powered platform helping Indian farmers make smarter decisions — from sowing to selling.
              </p>
              <div className="fe-footer-stat-row">
                <span className="fe-footer-stat">🎯 RF: 90.93% Accuracy</span>
                <span className="fe-footer-stat">📊 R² 0.942</span>
              </div>
              <div className="fe-footer-stat-row">
                <span className="fe-footer-stat">👨‍🌾 50%+ India's Population</span>
              </div>
            </Col>

            {/* Quick links */}
            <Col lg={2} md={6} sm={6} xs={6}>
              <div className="fe-footer-heading">Quick Links</div>
              {QUICK_LINKS.map(({ to, icon, label }) => (
                <Link key={to} to={to} className="fe-footer-link">
                  <span>{icon}</span>{label}
                </Link>
              ))}
            </Col>

            {/* Tech stack */}
            <Col lg={3} md={6} sm={6} xs={6}>
              <div className="fe-footer-heading">Tech Stack</div>
              <div>
                {TECH_STACK.map((t) => (
                  <span key={t} className="fe-tech-tag">{t}</span>
                ))}
              </div>
            </Col>

            {/* Contact / Team */}
            <Col lg={3} md={6}>
              <div className="fe-footer-heading">Project Info</div>
              <div className="fe-footer-contact-item">
                <span>🏫</span>
                <span>MMANTC, Malegaon<br />(Savitribai Phule Pune University)</span>
              </div>
              <div className="fe-footer-contact-item">
                <span>👨‍💻</span>
                <span>Nikam Prathmesh <br /> Pawar Pratik<br />Salunke Abhishek </span>
              </div>
              <div className="fe-footer-contact-item">
                <span>🎓</span>
                <span>Guide: Dr. Salman Baig</span>
              </div>
              <div className="fe-footer-contact-item">
                <span>🌐</span>
                <span style={{ color: '#52b788' }}>www.FarmEra.com</span>
              </div>
            </Col>

          </Row>
        </Container>

        <hr className="fe-footer-divider" />

        <Container>
          <div className="fe-footer-bottom">
            <p className="fe-footer-copy mb-0">
              © {new Date().getFullYear()} <strong>FarmEra</strong> — Farming Using AI & ML (Sowing to Selling). All rights reserved.
            </p>
            <span className="fe-footer-made">
              Made with <span>♥</span> for Indian Farmers
            </span>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
