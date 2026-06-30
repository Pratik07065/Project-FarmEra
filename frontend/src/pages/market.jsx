import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavScrollExample from '../navbar';
import Footer from '../common/footer';

/* ─────────────────────────────────────────────
   Pure CSS animations injected once on mount.
   Zero changes to axios / state / handlers.
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  /* ══ Page base ══ */
  .mk-page {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(155deg, #f0faf0 0%, #e6f4ea 55%, #f0f7ff 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* ══ Floating background particles ══ */
  .mk-bg {
    position: fixed; inset: 0;
    pointer-events: none; overflow: hidden; z-index: 0;
  }
  .mk-particle {
    position: absolute; opacity: 0.07;
    animation: mkFloat linear infinite;
  }
  @keyframes mkFloat {
    0%   { transform: translateY(108vh) rotate(0deg);  opacity: 0; }
    8%   { opacity: 0.07; }
    92%  { opacity: 0.07; }
    100% { transform: translateY(-8vh)  rotate(380deg); opacity: 0; }
  }

  /* ══ Content sits above bg ══ */
  .mk-content { position: relative; z-index: 1; }

  /* ══ Hero ══ */
  .mk-hero {
    text-align: center;
    padding: 2.8rem 1rem 2rem;
    animation: mkFadeDown 0.7s ease both;
  }
  .mk-hero-emoji-row {
    display: flex; justify-content: center; align-items: center; gap: 10px;
    margin-bottom: 14px;
    animation: mkPopIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.25s both;
  }
  .mk-hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #e8f5e2, #d0edff);
    border: 1.5px solid #b7e4c7;
    border-radius: 30px;
    padding: 5px 16px;
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #1b4332; margin-bottom: 12px;
  }
  .mk-hero-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #3a7d44;
    animation: mkPulse 1.8s ease infinite;
  }
  .mk-hero-title {
    font-size: 2.2rem; font-weight: 900;
    color: #1b4332; letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .mk-hero-sub {
    font-size: 0.95rem; color: #52796f; font-weight: 600;
    margin-bottom: 0;
  }

  /* ══ Tab switcher ══ */
  .mk-tabs {
    display: flex; justify-content: center; gap: 10px;
    flex-wrap: wrap;
    animation: mkFadeUp 0.6s ease 0.3s both;
  }
  .mk-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 22px;
    border-radius: 14px;
    font-family: 'Nunito', sans-serif;
    font-weight: 700; font-size: 0.9rem;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(.34,1.56,.64,1);
    position: relative; overflow: hidden;
  }
  .mk-tab:active { transform: scale(0.96); }
  .mk-tab .mk-tab-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.35);
    transform: scale(0);
    animation: mkRipple 0.55s linear;
    pointer-events: none;
  }
  @keyframes mkRipple { to { transform: scale(5); opacity: 0; } }

  /* All Info tab */
  .mk-tab-all {
    background: #e8f0fe; color: #1a56db; border-color: #c3d3fd;
  }
  .mk-tab-all.active {
    background: linear-gradient(135deg, #1a56db, #3b82f6);
    color: #fff; border-color: transparent;
    box-shadow: 0 6px 20px rgba(26,86,219,0.3);
    transform: translateY(-2px);
  }
  .mk-tab-all:hover:not(.active) { border-color: #93a9f7; transform: translateY(-1px); }

  /* Farmer tab */
  .mk-tab-farmer {
    background: #e8f5e2; color: #1b4332; border-color: #b7e4c7;
  }
  .mk-tab-farmer.active {
    background: linear-gradient(135deg, #3a7d44, #52b788);
    color: #fff; border-color: transparent;
    box-shadow: 0 6px 20px rgba(58,125,68,0.3);
    transform: translateY(-2px);
  }
  .mk-tab-farmer:hover:not(.active) { border-color: #74c69d; transform: translateY(-1px); }

  /* Merchant tab */
  .mk-tab-merchant {
    background: #e0f2fe; color: #0c4a6e; border-color: #bae6fd;
  }
  .mk-tab-merchant.active {
    background: linear-gradient(135deg, #0284c7, #38bdf8);
    color: #fff; border-color: transparent;
    box-shadow: 0 6px 20px rgba(2,132,199,0.3);
    transform: translateY(-2px);
  }
  .mk-tab-merchant:hover:not(.active) { border-color: #7dd3fc; transform: translateY(-1px); }

  /* ══ Stats strip ══ */
  .mk-stats {
    display: flex; justify-content: center; gap: 12px;
    flex-wrap: wrap; margin-bottom: 2rem;
    animation: mkFadeUp 0.6s ease 0.4s both;
  }
  .mk-stat-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 20px;
    font-size: 0.82rem; font-weight: 700;
    border: 1.5px solid;
  }
  .mk-stat-pill.all     { background: #e8f0fe; color: #1a56db; border-color: #c3d3fd; }
  .mk-stat-pill.farmer  { background: #e8f5e2; color: #1b4332; border-color: #b7e4c7; }
  .mk-stat-pill.merchant{ background: #e0f2fe; color: #0c4a6e; border-color: #bae6fd; }

  /* ══ Data cards ══ */
  .mk-card {
    border: none !important;
    border-radius: 20px !important;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
    animation: mkCardIn 0.5s ease both;
    background: #fff !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05) !important;
  }
  .mk-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
  }

  .mk-card-farmer-bar  { height: 5px; background: linear-gradient(90deg, #3a7d44, #52b788, #95d5b2); }
  .mk-card-merchant-bar{ height: 5px; background: linear-gradient(90deg, #0284c7, #38bdf8, #7dd3fc); }

  @keyframes mkCardIn {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .mk-card-name {
    font-size: 1rem; font-weight: 800; color: #1b2e22; margin: 0;
  }
  .mk-card-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 20px;
    font-size: 0.73rem; font-weight: 800; letter-spacing: 0.04em;
  }
  .mk-card-badge.farmer   { background: #d8f3dc; color: #1b4332; border: 1.5px solid #95d5b2; }
  .mk-card-badge.merchant { background: #e0f2fe; color: #0c4a6e; border: 1.5px solid #7dd3fc; }

  .mk-card-divider { border: none; border-top: 1.5px dashed #e8f0e8; margin: 10px 0; }

  .mk-card-row {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 0; font-size: 0.85rem; color: #4a5568;
  }
  .mk-card-row-icon { font-size: 13px; flex-shrink: 0; }
  .mk-card-row-label { font-weight: 700; color: #2d6a4f; min-width: 68px; }
  .mk-card-row-val   { font-weight: 600; color: #1a202c; }

  .mk-price-chip {
    display: inline-block;
    background: linear-gradient(135deg, #e8f5e2, #d8f3dc);
    color: #1b4332; font-weight: 800; font-size: 0.9rem;
    padding: 3px 10px; border-radius: 8px;
    border: 1px solid #95d5b2;
  }

  .mk-empty {
    text-align: center; padding: 4rem 1rem;
    animation: mkFadeUp 0.5s ease both;
  }
  .mk-empty-icon {
    font-size: 3.5rem; margin-bottom: 12px;
    animation: mkBob 2.5s ease-in-out infinite;
  }
  .mk-empty-text { font-size: 1rem; font-weight: 600; color: #52796f; }
  @keyframes mkBob {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }

  /* ══ Form card ══ */
  .mk-form-card {
    border: none !important;
    border-radius: 24px !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08) !important;
    animation: mkFadeUp 0.6s ease 0.15s both;
    overflow: hidden; position: relative;
  }
  .mk-form-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background-size: 200% auto;
    animation: mkShimmer 3s linear infinite;
  }
  .mk-form-card.farmer::before  { background: linear-gradient(90deg,#3a7d44,#52b788,#95d5b2,#52b788,#3a7d44); }
  .mk-form-card.merchant::before{ background: linear-gradient(90deg,#0284c7,#38bdf8,#7dd3fc,#38bdf8,#0284c7); }
  @keyframes mkShimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  /* ══ Form title ══ */
  .mk-form-title {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-size: 1.4rem; font-weight: 900; margin-bottom: 1.5rem;
  }
  .mk-form-title.farmer  { color: #1b4332; }
  .mk-form-title.merchant{ color: #0c4a6e; }
  .mk-form-title-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .mk-form-title-icon.farmer  { background: #d8f3dc; }
  .mk-form-title-icon.merchant{ background: #e0f2fe; }

  /* ══ Form section head ══ */
  .mk-form-section {
    display: flex; align-items: center; gap: 7px;
    font-size: 0.73rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin: 1rem 0 0.75rem;
    padding-bottom: 7px;
    border-bottom: 1.5px dashed;
  }
  .mk-form-section.farmer  { color: #2d6a4f; border-color: #d8f3dc; }
  .mk-form-section.merchant{ color: #0369a1; border-color: #bae6fd; }
  .mk-form-section-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .mk-form-section-dot.farmer  { background: #3a7d44; }
  .mk-form-section-dot.merchant{ background: #0284c7; }

  /* ══ Inputs ══ */
  .mk-input-wrap .form-control {
    border: 1.5px solid #d1d5db !important;
    border-radius: 12px !important;
    background: #fafffe !important;
    font-family: 'Nunito', sans-serif !important;
    font-weight: 600 !important; font-size: 0.92rem !important;
    color: #1a202c !important; padding: 10px 14px !important;
    transition: border-color 0.22s, box-shadow 0.22s, transform 0.18s, background 0.22s !important;
    outline: none !important;
  }
  .mk-form-card.farmer .mk-input-wrap .form-control:focus {
    border-color: #3a7d44 !important;
    box-shadow: 0 0 0 3px rgba(58,125,68,0.13) !important;
    transform: translateY(-2px) !important; background: #fff !important;
  }
  .mk-form-card.merchant .mk-input-wrap .form-control:focus {
    border-color: #0284c7 !important;
    box-shadow: 0 0 0 3px rgba(2,132,199,0.13) !important;
    transform: translateY(-2px) !important; background: #fff !important;
  }
  .mk-input-wrap .form-control:hover:not(:focus) {
    border-color: #9ca3af !important; background: #f9fafb !important;
  }
  .mk-input-wrap .form-control::placeholder {
    color: #9ca3af !important; font-weight: 400 !important;
  }

  /* ══ Labels ══ */
  .mk-label {
    font-weight: 700 !important; font-size: 0.83rem !important;
    margin-bottom: 5px !important;
    display: flex !important; align-items: center !important; gap: 5px !important;
  }
  .mk-label.farmer  { color: #2d6a4f !important; }
  .mk-label.merchant{ color: #0369a1 !important; }

  /* ══ Field stagger ══ */
  .mk-field {
    animation: mkFieldIn 0.45s ease both;
  }
  .mk-field:nth-child(1) { animation-delay: 0.04s; }
  .mk-field:nth-child(2) { animation-delay: 0.10s; }
  .mk-field:nth-child(3) { animation-delay: 0.16s; }
  .mk-field:nth-child(4) { animation-delay: 0.22s; }
  .mk-field:nth-child(5) { animation-delay: 0.28s; }
  .mk-field:nth-child(6) { animation-delay: 0.34s; }
  .mk-field:nth-child(7) { animation-delay: 0.40s; }
  @keyframes mkFieldIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ══ Submit & Reset buttons ══ */
  .mk-btn-submit {
    border: none !important;
    border-radius: 13px !important;
    font-family: 'Nunito', sans-serif !important;
    font-weight: 800 !important; font-size: 0.95rem !important;
    padding: 12px !important; color: #fff !important;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s !important;
    position: relative !important; overflow: hidden !important;
  }
  .mk-btn-submit.farmer  {
    background: linear-gradient(135deg, #3a7d44, #52b788) !important;
    box-shadow: 0 4px 18px rgba(58,125,68,0.35) !important;
  }
  .mk-btn-submit.merchant {
    background: linear-gradient(135deg, #0284c7, #38bdf8) !important;
    box-shadow: 0 4px 18px rgba(2,132,199,0.35) !important;
  }
  .mk-btn-submit:hover {
    transform: translateY(-2px) !important;
    filter: brightness(1.06) !important;
  }
  .mk-btn-submit:active { transform: scale(0.97) !important; }
  .mk-btn-submit .mk-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: scale(0); animation: mkRippleAnim 0.55s linear;
    pointer-events: none;
  }
  @keyframes mkRippleAnim { to { transform: scale(5); opacity: 0; } }

  .mk-btn-reset {
    border: 1.5px solid #d1d5db !important;
    border-radius: 13px !important;
    background: transparent !important;
    font-family: 'Nunito', sans-serif !important;
    font-weight: 700 !important; font-size: 0.9rem !important;
    color: #6b7280 !important; padding: 12px 18px !important;
    transition: all 0.2s !important;
  }
  .mk-btn-reset:hover {
    background: #f3f4f6 !important; border-color: #9ca3af !important;
    color: #374151 !important; transform: translateY(-1px) !important;
  }

  /* ══ Pulse ring on submit ══ */
  .mk-pulse-wrap { position: relative; flex: 1; }
  .mk-pulse-ring {
    position: absolute; inset: -4px; border-radius: 17px;
    border: 2px solid; pointer-events: none;
    animation: mkPulseRing 2s ease-out infinite;
  }
  .mk-pulse-ring.farmer  { border-color: rgba(82,183,136,0.5); }
  .mk-pulse-ring.merchant{ border-color: rgba(56,189,248,0.5); }
  @keyframes mkPulseRing {
    0%   { transform: scale(1);    opacity: 0.7; }
    100% { transform: scale(1.07); opacity: 0; }
  }

  /* ══ Shared keyframes ══ */
  @keyframes mkFadeDown {
    from { opacity: 0; transform: translateY(-18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mkFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mkPopIn {
    from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes mkPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.6); }
  }
`;

/* ── Floating bg particles ── */
const BG_SVGS = [
  `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z" fill="#3a7d44"/></svg>`,
  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#0284c7"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="#e0f2fe" font-weight="bold">₹</text></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7L2 9l7-1z" fill="#52b788"/></svg>`,
];

const FloatingBg = () => {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i, left: `${4 + i * 7}%`,
    size: `${14 + (i % 4) * 5}px`,
    dur: `${12 + (i % 5) * 3.5}s`,
    delay: `${i * 1.5}s`,
    svg: BG_SVGS[i % 3],
  }));
  return (
    <div className="mk-bg">
      {items.map(p => (
        <div key={p.id} className="mk-particle"
          style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }}
          dangerouslySetInnerHTML={{ __html: p.svg }} />
      ))}
    </div>
  );
};

/* ── Ripple helper ── */
const addRipple = (e) => {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const r = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  r.className = 'mk-ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
};

/* ── Tab ripple ── */
const addTabRipple = (e) => {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const r = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  r.className = 'mk-tab-ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
};

/* ══════════════════════════════════════════
   MAIN COMPONENT — logic 100% identical
══════════════════════════════════════════ */
const Market = () => {

  // ── Your original state ──────────────────
  const [activeSection, setActiveSection] = useState('All_Info');
  const [allData, setAllData] = useState([]);

  const initialFarmerState = { Name: '', farmerId: '', contact: '', emailId: '', product: '', quantity: '', price: '' };
  const initialMerchantState = { Name: '', merchantId: '', contact: '', emailId: '', product: '', quantity: '', price: '' };

  const [farmerForm, setFarmerForm] = useState(initialFarmerState);
  const [merchantForm, setMerchantForm] = useState(initialMerchantState);

  const API_URL = "http://127.0.0.1:5000";

  // ── Your original handlers ───────────────
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/market/all_info`);
      setAllData(res.data);
    } catch (err) {
      console.error("Backend not connected or /all_info route missing.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/market/farmer`, farmerForm);
      alert("Farmer Data Submitted!");
      fetchData();
      setActiveSection('All_Info');
      setFarmerForm(initialFarmerState);
    } catch (err) { alert("Error connecting to Backend"); }
  };

  const handleMerchantSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/market/merchant`, merchantForm);
      alert("Merchant Data Submitted!");
      fetchData();
      setActiveSection('All_Info');
      setMerchantForm(initialMerchantState);
    } catch (err) { alert("Error connecting to Backend"); }
  };

  // ── Inject CSS once ──────────────────────
  useEffect(() => {
    const tag = document.createElement('style');
    tag.id = 'mk-styles';
    tag.textContent = STYLES;
    if (!document.getElementById('mk-styles')) document.head.appendChild(tag);
    return () => { const t = document.getElementById('mk-styles'); if (t) t.remove(); };
  }, []);

  // ── Derived counts for stats pills ──────
  const farmerCount = allData.filter(d => d.farmerId).length;
  const merchantCount = allData.filter(d => d.merchantId).length;

  /* ── Render ── */
  return (
    <div>
      <div className="mk-page">

        {/* Your original NavScrollExample — untouched */}
        <NavScrollExample />

        {/* Floating background */}
        <FloatingBg />

        <div className="mk-content">
          <Container className="py-4 pb-5">

            {/* ── Hero ── */}
            <div className="mk-hero">
              <div className="mk-hero-badge">
                <span className="mk-hero-dot" />
                FarmEra · Live Marketplace
              </div>
              <h2 className="mk-hero-title">🌾 Market Place</h2>
              <p className="mk-hero-sub">Connect farmers and merchants in one platform</p>
            </div>

            {/* ── Stats pills ── */}
            <div className="mk-stats">
              <span className="mk-stat-pill all">
                📋 Total Listings: <strong style={{ marginLeft: 4 }}>{allData.length}</strong>
              </span>
              <span className="mk-stat-pill farmer">
                🌿 Farmers: <strong style={{ marginLeft: 4 }}>{farmerCount}</strong>
              </span>
              <span className="mk-stat-pill merchant">
                🏪 Merchants: <strong style={{ marginLeft: 4 }}>{merchantCount}</strong>
              </span>
            </div>

            {/* ── Tab buttons — your original onClick untouched ── */}
            <div className="mk-tabs mb-5">
              <button
                className={`mk-tab mk-tab-all ${activeSection === 'All_Info' ? 'active' : ''}`}
                onClick={(e) => { addTabRipple(e); setActiveSection('All_Info'); }}
              >
                📋 All Information
              </button>
              <button
                className={`mk-tab mk-tab-farmer ${activeSection === 'Farmer_Info' ? 'active' : ''}`}
                onClick={(e) => { addTabRipple(e); setActiveSection('Farmer_Info'); }}
              >
                🌿 Farmer Entry
              </button>
              <button
                className={`mk-tab mk-tab-merchant ${activeSection === 'Merchant_Info' ? 'active' : ''}`}
                onClick={(e) => { addTabRipple(e); setActiveSection('Merchant_Info'); }}
              >
                🏪 Merchant Entry
              </button>
            </div>

            {/* ══ DASHBOARD — your original logic ══ */}
            {activeSection === 'All_Info' && (
              <Row>
                {allData.length > 0 ? allData.map((item, index) => (
                  <Col md={4} key={index} className="mb-4">
                    <Card className="mk-card h-100" style={{ animationDelay: `${index * 0.07}s` }}>

                      {/* Colored top bar — farmer = green, merchant = blue */}
                      <div className={item.farmerId ? 'mk-card-farmer-bar' : 'mk-card-merchant-bar'} />

                      <Card.Body className="p-3">
                        {/* Header row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <h5 className="mk-card-name">{item.Name}</h5>
                          <span className={`mk-card-badge ${item.farmerId ? 'farmer' : 'merchant'}`}>
                            {item.farmerId ? '🌿 Farmer' : '🏪 Merchant'}
                          </span>
                        </div>

                        <hr className="mk-card-divider" />

                        {/* Details */}
                        <div className="mk-card-row">
                          <span className="mk-card-row-icon">📦</span>
                          <span className="mk-card-row-label">Product</span>
                          <span className="mk-card-row-val">{item.product}</span>
                        </div>
                        <div className="mk-card-row">
                          <span className="mk-card-row-icon">⚖️</span>
                          <span className="mk-card-row-label">Quantity</span>
                          <span className="mk-card-row-val">{item.quantity}</span>
                        </div>
                        <div className="mk-card-row">
                          <span className="mk-card-row-icon">💰</span>
                          <span className="mk-card-row-label">Price</span>
                          <span className="mk-price-chip">₹ {item.price}</span>
                        </div>
                        <div className="mk-card-row">
                          <span className="mk-card-row-icon">📞</span>
                          <span className="mk-card-row-label">Contact</span>
                          <span className="mk-card-row-val">{item.contact}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )) : (
                  <Col>
                    <div className="mk-empty">
                      <div className="mk-empty-icon">🌾</div>
                      <p className="mk-empty-text">No listings yet — be the first to add one!</p>
                    </div>
                  </Col>
                )}
              </Row>
            )}

            {/* ══ FARMER FORM — your original logic ══ */}
            {activeSection === 'Farmer_Info' && (
              <Row className="justify-content-center">
                <Col md={6}>
                  <Card className="mk-form-card farmer p-4">

                    {/* Title */}
                    <div className="mk-form-title farmer">
                      <div className="mk-form-title-icon farmer">🌿</div>
                      Farmer Entry
                    </div>

                    <Form onSubmit={handleFarmerSubmit}>

                      {/* Identity section */}
                      <div className="mk-form-section farmer">
                        <div className="mk-form-section-dot farmer" />
                        Identity
                      </div>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label farmer">👤 Name</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Full name" value={farmerForm.Name} required onChange={e => setFarmerForm({ ...farmerForm, Name: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label farmer">🪪 Farmer ID</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Unique farmer ID" value={farmerForm.farmerId} required onChange={e => setFarmerForm({ ...farmerForm, farmerId: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label farmer">📞 Contact</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Mobile number" value={farmerForm.contact} onChange={e => setFarmerForm({ ...farmerForm, contact: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label farmer">📧 Email</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control type="email" placeholder="Email address" value={farmerForm.emailId} onChange={e => setFarmerForm({ ...farmerForm, emailId: e.target.value })} />
                        </div>
                      </Form.Group>

                      {/* Listing section */}
                      <div className="mk-form-section farmer" style={{ marginTop: '1.25rem' }}>
                        <div className="mk-form-section-dot farmer" />
                        Produce Listing
                      </div>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label farmer">📦 Product</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="e.g. Onion" value={farmerForm.product} onChange={e => setFarmerForm({ ...farmerForm, product: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label farmer">⚖️ Quantity</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="e.g. 50 quintals" value={farmerForm.quantity} onChange={e => setFarmerForm({ ...farmerForm, quantity: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 mk-field">
                        <Form.Label className="mk-label farmer">💰 Price (₹)</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Expected price" value={farmerForm.price} onChange={e => setFarmerForm({ ...farmerForm, price: e.target.value })} />
                        </div>
                      </Form.Group>

                      {/* Buttons */}
                      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                        <div className="mk-pulse-wrap">
                          <div className="mk-pulse-ring farmer" />
                          <Button type="submit" className="w-100 mk-btn-submit farmer" onClick={addRipple}>
                            🌿 Save Farmer
                          </Button>
                        </div>
                        <Button type="button" className="mk-btn-reset" onClick={() => setFarmerForm(initialFarmerState)}>
                          ↺ Reset
                        </Button>
                      </div>

                    </Form>
                  </Card>
                </Col>
              </Row>
            )}

            {/* ══ MERCHANT FORM — your original logic ══ */}
            {activeSection === 'Merchant_Info' && (
              <Row className="justify-content-center">
                <Col md={6}>
                  <Card className="mk-form-card merchant p-4">

                    {/* Title */}
                    <div className="mk-form-title merchant">
                      <div className="mk-form-title-icon merchant">🏪</div>
                      Merchant Entry
                    </div>

                    <Form onSubmit={handleMerchantSubmit}>

                      {/* Identity section */}
                      <div className="mk-form-section merchant">
                        <div className="mk-form-section-dot merchant" />
                        Identity
                      </div>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label merchant">👤 Name</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Full name" value={merchantForm.Name} required onChange={e => setMerchantForm({ ...merchantForm, Name: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label merchant">🪪 Merchant ID</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Unique merchant ID" value={merchantForm.merchantId} required onChange={e => setMerchantForm({ ...merchantForm, merchantId: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label merchant">📞 Contact</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Mobile number" value={merchantForm.contact} onChange={e => setMerchantForm({ ...merchantForm, contact: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label merchant">📧 Email</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control type="email" placeholder="Email address" value={merchantForm.emailId} onChange={e => setMerchantForm({ ...merchantForm, emailId: e.target.value })} />
                        </div>
                      </Form.Group>

                      {/* Listing section */}
                      <div className="mk-form-section merchant" style={{ marginTop: '1.25rem' }}>
                        <div className="mk-form-section-dot merchant" />
                        Purchase Requirement
                      </div>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label merchant">📦 Product</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="e.g. Onion" value={merchantForm.product} onChange={e => setMerchantForm({ ...merchantForm, product: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-2 mk-field">
                        <Form.Label className="mk-label merchant">⚖️ Quantity</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="e.g. 100 quintals" value={merchantForm.quantity} onChange={e => setMerchantForm({ ...merchantForm, quantity: e.target.value })} />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3 mk-field">
                        <Form.Label className="mk-label merchant">💰 Offered Price (₹)</Form.Label>
                        <div className="mk-input-wrap">
                          <Form.Control placeholder="Offered price" value={merchantForm.price} onChange={e => setMerchantForm({ ...merchantForm, price: e.target.value })} />
                        </div>
                      </Form.Group>

                      {/* Buttons */}
                      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                        <div className="mk-pulse-wrap">
                          <div className="mk-pulse-ring merchant" />
                          <Button type="submit" className="w-100 mk-btn-submit merchant" onClick={addRipple}>
                            🏪 Save Merchant
                          </Button>
                        </div>
                        <Button type="button" className="mk-btn-reset" onClick={() => setMerchantForm(initialMerchantState)}>
                          ↺ Reset
                        </Button>
                      </div>

                    </Form>
                  </Card>
                </Col>
              </Row>
            )}

          </Container>
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default Market;