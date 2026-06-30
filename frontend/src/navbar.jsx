import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "./components/Logo.png";
import AuthGateModal from './common/AuthGateModal';
import {
  clearStoredAdmin,
  clearStoredUser,
  getStoredAdmin,
  getStoredUser,
  setStoredUser,
} from './common/authStorage';

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .fe-navbar {
    font-family: 'Nunito', sans-serif !important;
    background: rgba(255,255,255,0.92) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    border-bottom: 1px solid rgba(58,125,68,0.12) !important;
    transition: box-shadow 0.3s ease, background 0.3s ease !important;
    padding: 6px 0 !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1050 !important;
  }
  .fe-navbar.scrolled {
    box-shadow: 0 4px 24px rgba(58,125,68,0.12) !important;
    background: rgba(255,255,255,0.97) !important;
  }

  .fe-brand {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    text-decoration: none !important;
  }
  .fe-brand-logo {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px rgba(58,125,68,0.3);
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
    overflow: hidden;
    flex-shrink: 0;
  }
  .fe-brand-logo:hover { transform: rotate(-5deg) scale(1.1); }
  .fe-brand-name {
    font-weight: 900 !important;
    font-size: 1.18rem !important;
    color: #1b4332 !important;
    letter-spacing: -0.3px !important;
  }
  .fe-brand-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #52b788; display: inline-block;
    margin-left: 1px; vertical-align: super; font-size: 0.6rem;
  }

  .fe-nav-link {
    font-weight: 700 !important;
    font-size: 0.88rem !important;
    color: #374151 !important;
    padding: 6px 12px !important;
    border-radius: 9px !important;
    transition: all 0.2s ease !important;
    position: relative !important;
    white-space: nowrap !important;
  }
  .fe-nav-link:hover {
    color: #1b4332 !important;
    background: #e8f5e2 !important;
  }
  .fe-nav-link.active-link {
    color: #1b4332 !important;
    background: #d8f3dc !important;
  }
  .fe-nav-link.active-link::after {
    content: '';
    position: absolute;
    bottom: 3px; left: 50%; transform: translateX(-50%);
    width: 16px; height: 2.5px;
    background: #3a7d44; border-radius: 2px;
  }

  .fe-login-btn {
    font-family: 'Nunito', sans-serif !important;
    font-weight: 800 !important;
    font-size: 0.84rem !important;
    padding: 6px 18px !important;
    border-radius: 10px !important;
    border: 2px solid #3a7d44 !important;
    color: #3a7d44 !important;
    background: transparent !important;
    transition: all 0.2s cubic-bezier(.34,1.56,.64,1) !important;
    margin-left: 6px !important;
  }
  .fe-login-btn:hover {
    background: linear-gradient(135deg, #3a7d44, #52b788) !important;
    color: #fff !important;
    border-color: transparent !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 14px rgba(58,125,68,0.3) !important;
  }

  .fe-user-menu .dropdown-toggle::after { margin-left: 6px; }
  .fe-user-menu .dropdown-menu {
    border-radius: 14px !important;
    border: 1px solid #d8f3dc !important;
    box-shadow: 0 12px 40px rgba(58,125,68,0.15) !important;
    padding: 8px !important;
    min-width: 200px !important;
  }
  .fe-user-menu .dropdown-item {
    font-weight: 700 !important;
    font-size: 0.88rem !important;
    border-radius: 10px !important;
    padding: 8px 12px !important;
    color: #374151 !important;
  }
  .fe-user-menu .dropdown-item:hover {
    background: #e8f5e2 !important;
    color: #1b4332 !important;
  }
  .fe-user-menu .dropdown-item.text-danger:hover {
    background: #fef2f2 !important;
    color: #b91c1c !important;
  }

  .navbar-toggler {
    border: 1.5px solid #b7e4c7 !important;
    border-radius: 10px !important;
    padding: 5px 8px !important;
  }
  .navbar-toggler:focus { box-shadow: 0 0 0 3px rgba(58,125,68,0.15) !important; }
`;

function NavScrollExample() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUser, setAuthUser] = useState(() => getStoredUser());
  const [authAdmin, setAuthAdmin] = useState(() => getStoredAdmin());
  const location = useLocation();
  const navigate = useNavigate();

  const refreshAuth = () => {
    setAuthUser(getStoredUser());
    setAuthAdmin(getStoredAdmin());
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!document.getElementById('fe-nav-styles')) {
      const tag = document.createElement('style');
      tag.id = 'fe-nav-styles';
      tag.textContent = NAV_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
    window.addEventListener('farmera-auth-change', refreshAuth);
    return () => window.removeEventListener('farmera-auth-change', refreshAuth);
  }, []);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('fe_auth_popup_seen') === '1';
    if (!hasSeenPopup && !authUser && !authAdmin) {
      setShowAuthModal(true);
      sessionStorage.setItem('fe_auth_popup_seen', '1');
    }
  }, [authUser, authAdmin]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearStoredUser();
    clearStoredAdmin();
    refreshAuth();
    navigate('/');
  };

  const navLinks = [
    { to: '/',                label: '🏠 Home' },
    { to: '/yield-prediction', label: '🌾 Yield Predictor' },
    { to: '/disease-prediction', label: '🍃 Disease Predictor' },
    { to: '/rate-predictor',   label: '💰 Rate Predictor' },
    { to: '/market-rate',      label: '📈 Live Rate' },
    { to: '/market',           label: '🏪 Market' },
    { to: '/chatbot',          label: '🤖 Chatbot' },
  ];

  const displayName = authUser?.userName || authUser?.farmerId || null;
  const adminName = authAdmin?.adminId;

  const renderAuthControl = () => {
    if (adminName) {
      return (
        <Dropdown align="end" className="fe-user-menu ms-2">
          <Dropdown.Toggle variant="outline-success" className="fe-login-btn" id="admin-dropdown">
            🛡️ {adminName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/admin-panel">Admin Panel</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    if (displayName) {
      return (
        <Dropdown align="end" className="fe-user-menu ms-2">
          <Dropdown.Toggle variant="outline-success" className="fe-login-btn" id="user-dropdown">
            👤 {displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <Button className="fe-login-btn ms-2" onClick={() => setShowAuthModal(true)}>
        👤 Log / Reg
      </Button>
    );
  };

  return (
    <Navbar expand="lg" className={`fe-navbar ${scrolled ? 'scrolled' : ''}`}>
      <Container fluid className="px-3 px-lg-4">

        <Link to="/" className="fe-brand navbar-brand">
          <div className="fe-brand-logo">
            <img alt="FarmEra Logo" src={logo} width="34" height="34" style={{ objectFit: 'cover' }} />
          </div>
          <span className="fe-brand-name">
            FarmEra<span className="fe-brand-dot" />
          </span>
        </Link>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0 align-items-lg-center gap-1" navbarScroll>
            {navLinks.map(({ to, label }) => (
              <Nav.Link
                key={to}
                as={Link}
                to={to}
                className={`fe-nav-link ${isActive(to) ? 'active-link' : ''}`}
              >
                {label}
              </Nav.Link>
            ))}
            {renderAuthControl()}
          </Nav>
        </Navbar.Collapse>

      </Container>
      <AuthGateModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onOpenAuthPage={() => {
          setShowAuthModal(false);
          navigate('/log?tab=signup');
        }}
        onAuthSuccess={(userData) => {
          setStoredUser(userData);
          refreshAuth();
          setShowAuthModal(false);
        }}
        onAdminSuccess={(adminData) => {
          setShowAuthModal(false);
          navigate('/admin-panel');
        }}
      />
    </Navbar>
  );
}

export default NavScrollExample;
