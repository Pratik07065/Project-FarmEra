import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import NavScrollExample from '../navbar';
import Footer from '../common/footer';

/* ─────────────────────────────────────────────
   State & District Mapping Data
   (You can add more states and districts here)
───────────────────────────────────────────── */
const STATE_DISTRICT_MAP = {
  "Maharashtra": ["Nashik", "Pune", "Ahmednagar", "Jalgaon", "Dhule", "Solapur", "Satara", "Kolhapur", "Nagpur", "Amravati", "Mumbai", "Thane"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Mathura", "Lucknow", "Varanasi", "Kanpur", "Prayagraj", "Meerut", "Gorakhpur"],
  "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Bhavnagar", "Vadodara", "Jamnagar", "Junagadh", "Gandhinagar"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Ujjain", "Gwalior", "Jabalpur", "Sagar", "Rewa"],
  "Karnataka": ["Bengaluru", "Mysuru", "Belagavi", "Hubballi", "Mangaluru", "Dharwad", "Kalaburagi"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur"],
  "Haryana": ["Ambala", "Karnal", "Rohtak", "Hisar", "Panipat", "Gurugram", "Faridabad"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Bikaner", "Kota", "Ajmer", "Alwar"],
  "West Bengal": ["Kolkata", "Hooghly", "Burdwan", "Darjeeling", "Malda", "Nadia"],
  "Andhra Pradesh": ["Guntur", "Krishna", "Godavari", "Kurnool", "Nellore", "Chittoor"],
  "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"]
};

/* ─────────────────────────────────────────────
   Pure CSS animations & styling
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  /* ══ Page ══ */
  .mr-page {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(155deg, #f0faf0 0%, #e6f4ea 55%, #f0f7ff 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* ══ Floating bg particles ══ */
  .mr-bg {
    position: fixed; inset: 0;
    pointer-events: none; overflow: hidden; z-index: 0;
  }
  .mr-particle {
    position: absolute; opacity: 0.07;
    animation: mrFloat linear infinite;
  }
  @keyframes mrFloat {
    0%   { transform: translateY(108vh) rotate(0deg);  opacity: 0; }
    8%   { opacity: 0.07; }
    92%  { opacity: 0.07; }
    100% { transform: translateY(-8vh) rotate(380deg); opacity: 0; }
  }

  /* ══ Content layer ══ */
  .mr-content { position: relative; z-index: 1; }

  /* ══ Hero ══ */
  .mr-hero {
    text-align: center;
    padding: 2.8rem 1rem 0.5rem;
    animation: mrFadeDown 0.7s ease both;
  }
  .mr-hero-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 68px; height: 68px;
    background: linear-gradient(135deg, #1a56db, #3b82f6);
    border-radius: 20px; margin-bottom: 14px;
    box-shadow: 0 8px 24px rgba(26,86,219,0.28);
    animation: mrPopIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.25s both;
  }
  .mr-hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #e8f0fe, #e0f2fe);
    border: 1.5px solid #c3d3fd; border-radius: 30px;
    padding: 5px 16px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #1a3a8f; margin-bottom: 12px;
    animation: mrFadeDown 0.5s ease 0.15s both;
  }
  .mr-hero-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #1a56db; animation: mrPulse 1.8s ease infinite;
  }
  .mr-hero-title {
    font-size: 2.2rem; font-weight: 900;
    color: #1e3a5f; letter-spacing: -0.5px; margin-bottom: 6px;
  }
  .mr-hero-sub {
    font-size: 0.95rem; color: #4a6785; font-weight: 600; margin-bottom: 0;
  }

  /* ══ Search card ══ */
  .mr-search-card {
    border: none !important;
    border-radius: 24px !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(26,86,219,0.1) !important;
    animation: mrFadeUp 0.7s ease 0.2s both;
    overflow: hidden; position: relative;
  }
  .mr-search-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #1a56db, #3b82f6, #93c5fd, #3b82f6, #1a56db);
    background-size: 200% auto;
    animation: mrShimmer 3s linear infinite;
  }
  @keyframes mrShimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  /* ══ Search title ══ */
  .mr-search-title {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-size: 1.4rem; font-weight: 900; color: #1e3a5f; margin-bottom: 1.5rem;
  }
  .mr-search-title-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    background: #e8f0fe; font-size: 1.2rem;
  }

  /* ══ Section head ══ */
  .mr-section-head {
    display: flex; align-items: center; gap: 7px;
    font-size: 0.73rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #1a56db; margin-bottom: 0.75rem;
    padding-bottom: 7px; border-bottom: 1.5px dashed #c3d3fd;
  }
  .mr-section-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #1a56db; flex-shrink: 0;
  }

  /* ══ Labels ══ */
  .mr-label {
    font-weight: 700 !important; font-size: 0.85rem !important;
    color: #1a3a8f !important; margin-bottom: 5px !important;
    display: flex !important; align-items: center !important; gap: 5px !important;
  }

  /* ══ Inputs & Selects ══ */
  .mr-input-wrap .form-control, .mr-input-wrap .form-select {
    border: 1.5px solid #c3d3fd !important;
    border-radius: 12px !important; background: #f8fbff !important;
    font-family: 'Nunito', sans-serif !important;
    font-weight: 600 !important; font-size: 0.92rem !important;
    color: #1e3a5f !important; padding: 10px 14px !important;
    transition: border-color 0.22s, box-shadow 0.22s, transform 0.18s, background 0.22s !important;
    outline: none !important; cursor: pointer;
  }
  .mr-input-wrap .form-control:focus, .mr-input-wrap .form-select:focus {
    border-color: #1a56db !important;
    box-shadow: 0 0 0 3px rgba(26,86,219,0.13) !important;
    transform: translateY(-2px) !important; background: #fff !important;
  }
  .mr-input-wrap .form-control:hover:not(:focus), .mr-input-wrap .form-select:hover:not(:focus) {
    border-color: #93b4f7 !important; background: #f0f4ff !important;
  }
  .mr-input-wrap .form-select option { font-weight: 600; color: #1e3a5f; }

  /* ══ Field stagger ══ */
  .mr-field { animation: mrFieldIn 0.45s ease both; }
  .mr-field:nth-child(1) { animation-delay: 0.05s; }
  .mr-field:nth-child(2) { animation-delay: 0.14s; }
  @keyframes mrFieldIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ══ Submit button ══ */
  .mr-btn-submit {
    background: linear-gradient(135deg, #1a56db, #3b82f6) !important;
    border: none !important; border-radius: 13px !important;
    font-family: 'Nunito', sans-serif !important;
    font-weight: 800 !important; font-size: 1rem !important;
    padding: 13px !important; color: #fff !important;
    box-shadow: 0 4px 20px rgba(26,86,219,0.35) !important;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s !important;
    position: relative !important; overflow: hidden !important;
  }
  .mr-btn-submit:not(:disabled):hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 28px rgba(26,86,219,0.45) !important;
    filter: brightness(1.06) !important;
  }
  .mr-btn-submit:not(:disabled):active { transform: scale(0.97) !important; }
  .mr-btn-submit:disabled {
    background: linear-gradient(135deg, #93b4f7, #bfdbfe) !important;
    box-shadow: none !important;
  }
  .mr-btn-submit .mr-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: scale(0); animation: mrRipple 0.55s linear; pointer-events: none;
  }
  @keyframes mrRipple { to { transform: scale(5); opacity: 0; } }

  /* pulse ring */
  .mr-pulse-wrap { position: relative; }
  .mr-pulse-ring {
    position: absolute; inset: -4px; border-radius: 17px;
    border: 2px solid rgba(59,130,246,0.45);
    animation: mrPulseRing 2s ease-out infinite; pointer-events: none;
  }
  @keyframes mrPulseRing {
    0%   { transform: scale(1);    opacity: 0.7; }
    100% { transform: scale(1.07); opacity: 0; }
  }

  /* ══ Results header & View Toggle ══ */
  .mr-results-header {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 15px;
    margin-bottom: 1.5rem; padding-bottom: 12px;
    border-bottom: 1.5px dashed #c3d3fd;
    animation: mrFadeDown 0.5s ease both;
  }
  .mr-results-title-wrap {
    display: flex; flex-direction: column; gap: 6px;
  }
  .mr-results-title {
    font-size: 1.1rem; font-weight: 900; color: #1e3a5f;
    display: flex; align-items: center; gap: 8px;
  }
  .mr-results-count {
    display: inline-flex; align-items: center; gap: 5px;
    background: #e8f0fe; color: #1a56db;
    border: 1.5px solid #c3d3fd; border-radius: 20px;
    padding: 5px 14px; font-size: 0.82rem; font-weight: 800;
  }

  /* View Toggle Buttons */
  .mr-toggle-group {
    display: flex; align-items: center; gap: 4px;
    background: #e8f0fe; padding: 5px; border-radius: 14px;
    border: 1px solid #c3d3fd;
  }
  .mr-toggle-btn {
    border: none; background: transparent;
    padding: 8px 18px; border-radius: 10px;
    font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.85rem;
    color: #4a6785; transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    display: flex; align-items: center; gap: 6px;
  }
  .mr-toggle-btn:hover { color: #1a56db; }
  .mr-toggle-btn.active {
    background: #fff; color: #1a56db;
    box-shadow: 0 4px 12px rgba(26,86,219,0.15);
  }

  /* ══ Market card ══ */
  .mr-card {
    border: none !important; border-radius: 20px !important;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(26,86,219,0.06) !important;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
    animation: mrCardIn 0.5s ease both;
    background: #fff !important;
  }
  .mr-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 12px 40px rgba(26,86,219,0.15) !important;
  }
  @keyframes mrCardIn {
    from { opacity: 0; transform: translateY(22px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)  scale(1); }
  }

  /* Card header bar */
  .mr-card-header {
    background: linear-gradient(135deg, #1a56db, #3b82f6) !important;
    color: #fff !important; font-family: 'Nunito', sans-serif !important;
    font-weight: 800 !important; font-size: 0.92rem !important;
    padding: 10px 14px !important; border: none !important;
    letter-spacing: 0.02em;
  }

  /* Card market name */
  .mr-card-market { font-size: 1.05rem; font-weight: 800; color: #1e3a5f; margin-bottom: 10px; }

  /* Card meta rows */
  .mr-card-meta {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.83rem; color: #4a5568; margin-bottom: 5px;
  }
  .mr-card-meta-label { font-weight: 700; color: #1a56db; min-width: 52px; }
  .mr-card-meta-val   { font-weight: 600; color: #1e3a5f; }

  .mr-card-date {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.76rem; color: #6b7280; font-weight: 600;
    background: #f3f4f6; border-radius: 8px; padding: 3px 9px; margin-top: 4px;
  }

  /* Card divider */
  .mr-card-divider { border: none; border-top: 1.5px dashed #e8f0fe; margin: 10px 0; }

  /* Price chips in footer */
  .mr-card-footer {
    background: #f8fbff !important; border: none !important;
    padding: 12px 14px !important;
    display: flex !important; justify-content: space-around !important;
    align-items: center !important; gap: 8px !important; flex-wrap: wrap !important;
  }
  .mr-price-chip {
    display: inline-flex; flex-direction: column; align-items: center;
    padding: 6px 14px; border-radius: 12px; font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 0.82rem; min-width: 72px;
    border: 1.5px solid; cursor: default; transition: transform 0.15s;
  }
  .mr-price-chip:hover { transform: translateY(-2px); }
  .mr-price-chip-label { font-size: 0.68rem; font-weight: 700; opacity: 0.75; margin-bottom: 1px; }
  .mr-price-chip-val   { font-size: 0.92rem; font-weight: 900; }
  .mr-chip-min  { background: #dcfce7; color: #14532d; border-color: #86efac; }
  .mr-chip-avg  { background: #fef9c3; color: #713f12; border-color: #fde047; }
  .mr-chip-max  { background: #fee2e2; color: #7f1d1d; border-color: #fca5a5; }

  /* ══ Table View Styles ══ */
  .mr-table-wrapper {
    background: #fff; border-radius: 20px; padding: 1.5rem;
    box-shadow: 0 8px 30px rgba(26,86,219,0.08);
    animation: mrFadeUp 0.5s ease both;
    overflow-x: auto;
  }
  .mr-table { width: 100%; min-width: 800px; border-collapse: separate; border-spacing: 0 10px; }
  .mr-table th {
    background: #e8f0fe; color: #1a56db; padding: 14px 18px;
    text-align: left; font-weight: 900; font-size: 0.9rem;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .mr-table th:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
  .mr-table th:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; text-align: right; }
  
  .mr-table td {
    background: #f8fbff; padding: 16px 18px; color: #1e3a5f;
    font-weight: 700; font-size: 0.92rem;
    border-top: 1.5px solid #e8f0fe; border-bottom: 1.5px solid #e8f0fe;
    transition: all 0.25s ease;
  }
  .mr-table td:first-child { border-left: 1.5px solid #e8f0fe; border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
  .mr-table td:last-child { border-right: 1.5px solid #e8f0fe; border-top-right-radius: 12px; border-bottom-right-radius: 12px; text-align: right; }
  
  .mr-tr-body { animation: mrCardIn 0.4s ease both; cursor: default; }
  .mr-tr-body:hover td {
    background: #fff; border-color: #c3d3fd;
    box-shadow: 0 4px 15px rgba(26,86,219,0.1);
    transform: scale(1.005); z-index: 10; position: relative;
  }

  .mr-table-badge {
    display: inline-flex; background: #e0f2fe; color: #0369a1;
    padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 800;
  }
  .mr-table-price {
    font-size: 1.05rem; font-weight: 900; color: #1a56db;
  }

  /* ══ Error ══ */
  .mr-error {
    border-radius: 14px !important; border: none !important;
    font-family: 'Nunito', sans-serif !important; font-weight: 600 !important;
    animation: mrShake 0.5s ease both;
    box-shadow: 0 4px 16px rgba(220,53,69,0.15) !important;
  }
  @keyframes mrShake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }

  /* ══ Empty state ══ */
  .mr-empty {
    text-align: center; padding: 4rem 1rem;
    animation: mrFadeUp 0.5s ease both;
  }
  .mr-empty-icon { font-size: 3.5rem; margin-bottom: 12px; animation: mrBob 2.5s ease-in-out infinite; }
  .mr-empty-text { font-size: 1rem; font-weight: 600; color: #4a6785; }
  @keyframes mrBob {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }

  /* ══ Shared keyframes ══ */
  @keyframes mrFadeDown {
    from { opacity: 0; transform: translateY(-18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mrFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mrPopIn {
    from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes mrPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.6); }
  }
`;

/* ── Style injection helper ── */
const injectStyles = () => {
  if (!document.getElementById('mr-styles')) {
    const tag = document.createElement('style');
    tag.id = 'mr-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }
};

/* ── Floating background particles ── */
const BG_SVGS = [
  `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#1a56db"/><polyline points="9 22 9 12 15 12 15 22" fill="#3b82f6"/></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z" fill="#3a7d44"/></svg>`,
  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#1a56db"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="#e8f0fe" font-weight="bold">₹</text></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7L2 9l7-1z" fill="#f59e0b"/></svg>`,
];

const FloatingBg = () => {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i, left: `${4 + i * 7}%`,
    size: `${13 + (i % 4) * 5}px`,
    dur: `${13 + (i % 5) * 3}s`,
    delay: `${i * 1.4}s`,
    svg: BG_SVGS[i % 4],
  }));
  return (
    <div className="mr-bg">
      {items.map(p => (
        <div key={p.id} className="mr-particle"
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
  r.className = 'mr-ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
};

/* ══════════════════════════════════════════
   Carditem — logic untouched
══════════════════════════════════════════ */
function Carditem({ record, index }) {
  return (
    <Card className="mr-card h-100" style={{ animationDelay: `${(index % 12) * 0.06}s` }}>
      <Card.Header className="mr-card-header">🛒 {record.commodity}</Card.Header>
      <Card.Body className="px-3 pt-3 pb-2">
        <div className="mr-card-market">🏪 {record.market}</div>
        <hr className="mr-card-divider" />
        <div className="mr-card-meta">
          <span className="mr-card-meta-label">🌾 Variety</span>
          <span className="mr-card-meta-val">{record.variety}</span>
        </div>
        <div className="mr-card-meta">
          <span className="mr-card-meta-label">🏷️ Grade</span>
          <span className="mr-card-meta-val">{record.grade}</span>
        </div>
        <div className="mr-card-date">📅 {record.arrival_date}</div>
      </Card.Body>
      <Card.Footer className="mr-card-footer">
        <div className="mr-price-chip mr-chip-min">
          <span className="mr-price-chip-label">Min</span>
          <span className="mr-price-chip-val">₹{record.min_price}</span>
        </div>
        <div className="mr-price-chip mr-chip-avg">
          <span className="mr-price-chip-label">Modal</span>
          <span className="mr-price-chip-val">₹{record.modal_price}</span>
        </div>
        <div className="mr-price-chip mr-chip-max">
          <span className="mr-price-chip-label">Max</span>
          <span className="mr-price-chip-val">₹{record.max_price}</span>
        </div>
      </Card.Footer>
    </Card>
  );
}

/* ══════════════════════════════════════════
   InputMarInfo — updated with Dropdowns
══════════════════════════════════════════ */
function InputMarInfo({ stateName, setStateName, district, setDistrict, handleSubmit, loading }) {
  
  // Get available districts based on selected state
  const availableDistricts = stateName && STATE_DISTRICT_MAP[stateName] ? STATE_DISTRICT_MAP[stateName] : [];

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mr-search-card p-4">
            <div className="mr-search-title">
              <div className="mr-search-title-icon">🔍</div>
              Find Local Market Rates
            </div>

            <Form onSubmit={handleSubmit}>
              <div className="mr-section-head">
                <div className="mr-section-dot" />
                Location Details
              </div>

              {/* State Dropdown */}
              <Form.Group className="mb-3 mr-field" controlId="formBasicState">
                <Form.Label className="mr-label">📍 State Name</Form.Label>
                <div className="mr-input-wrap">
                  <Form.Select 
                    value={stateName} 
                    onChange={(e) => {
                      setStateName(e.target.value);
                      setDistrict(''); // Reset district when state changes
                    }} 
                    required
                  >
                    <option value="">Select a State</option>
                    {Object.keys(STATE_DISTRICT_MAP).sort().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>

              {/* District Dropdown */}
              <Form.Group className="mb-4 mr-field" controlId="formBasicDistrict">
                <Form.Label className="mr-label">🏘️ District Name</Form.Label>
                <div className="mr-input-wrap">
                  <Form.Select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)} 
                    required
                    disabled={!stateName} // Disable until state is chosen
                  >
                    <option value="">Select a District</option>
                    {availableDistricts.sort().map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>

              {/* Submit */}
              <div className="d-grid mr-pulse-wrap">
                {!loading && <div className="mr-pulse-ring" />}
                <Button className="mr-btn-submit" type="submit" disabled={loading} onClick={!loading ? addRipple : undefined}>
                  {loading ? (
                    <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Fetching market data...</>
                  ) : '📊 Search Market Rates'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

/* ══════════════════════════════════════════
   MarketRate — logic identical + View Toggle
══════════════════════════════════════════ */
function MarketRate() {

  const [stateName, setStateName] = useState('');
  const [district, setDistrict]   = useState('');
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  
  // NEW: State for toggling views
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stateName.trim() || !district.trim()) {
      setError('Please fill out both state and district fields.');
      return;
    }
    setLoading(true);
    setError('');
    setMarketData([]);

    const apiKey = "579b464db66ec23bdd000001a5b2a555ad6443d364f5e4439b9ff113";
    const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

    let allFetchedRecords = [];
    let offset = 0;
    const limit = 1000;
    let fetchErrorOccurred = false;

    while (true) {
      const apiUrl = `${baseUrl}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}&filters[state]=${stateName}&filters[district]=${district}`;
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Network response was not ok (status: ${res.status})`);
        const finalResp = await res.json();
        const newRecords = finalResp.records;
        if (!newRecords || newRecords.length === 0) break;
        allFetchedRecords = allFetchedRecords.concat(newRecords);
        offset += limit;
      } catch (fetchError) {
        console.error("Fetch Error during pagination:", fetchError);
        setError('Failed to fetch data. The API might be down or your request could not be processed. Please try again later.');
        fetchErrorOccurred = true;
        break;
      }
    }

    setLoading(false);
    if (!fetchErrorOccurred) {
      if (allFetchedRecords.length > 0) {
        setMarketData(allFetchedRecords);
      } else {
        setError('No market data found for the specified location. Please check your spelling or try another location.');
      }
    }
  };

  React.useEffect(() => {
    injectStyles();
    return () => { const t = document.getElementById('mr-styles'); if (t) t.remove(); };
  }, []);

  return (
    <div className="mr-page">
      <NavScrollExample />
      <FloatingBg />

      <div className="mr-content">
        <div className="mr-hero">
          <div className="mr-hero-badge"><span className="mr-hero-dot" /> FarmEra · Live API Data</div>
          <div className="mr-hero-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="mr-hero-title">📊 Live Market Rates</h2>
          <p className="mr-hero-sub">Real-time commodity prices from Government of India API</p>
        </div>

        <InputMarInfo
          stateName={stateName}
          setStateName={setStateName}
          district={district}
          setDistrict={setDistrict}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <Container className="pb-5">
          {error && <Alert variant="danger" className="mr-error mt-2 mb-4">⚠️ {error}</Alert>}

          {marketData.length > 0 && (
            <>
              {/* Results Header + View Toggle */}
              <div className="mr-results-header">
                <div className="mr-results-title-wrap">
                  <div className="mr-results-title">📋 Market Listings</div>
                  <span className="mr-results-count">
                    📦 {marketData.length} records found for <strong style={{ marginLeft: 4 }}>{district}, {stateName}</strong>
                  </span>
                </div>

                {/* The Toggle Buttons */}
                <div className="mr-toggle-group">
                  <button 
                    className={`mr-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setViewMode('card')}
                  >
                    🧱 Card View
                  </button>
                  <button 
                    className={`mr-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    📑 Table View
                  </button>
                </div>
              </div>

              {/* Conditional Rendering based on ViewMode */}
              {viewMode === 'card' ? (
                /* Card View (Original) */
                <Row xs={1} md={2} lg={3} className="g-4">
                  {marketData.map((record, index) => (
                    <Col key={`${record.market}-${record.commodity}-${index}`}>
                      <Carditem record={record} index={index} />
                    </Col>
                  ))}
                </Row>
              ) : (
                /* Animated Table View (New) */
                <div className="mr-table-wrapper">
                  <table className="mr-table">
                    <thead>
                      <tr>
                        <th>Market Name</th>
                        <th>Commodity</th>
                        <th>Variety / Grade</th>
                        <th>Arrival Date</th>
                        <th>Min Price</th>
                        <th>Max Price</th>
                        <th>Modal Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketData.map((record, index) => (
                        <tr key={`${record.market}-${record.commodity}-${index}`} className="mr-tr-body" style={{ animationDelay: `${(index % 10) * 0.04}s` }}>
                          <td>{record.market}</td>
                          <td><span className="mr-table-badge">{record.commodity}</span></td>
                          <td>{record.variety} <span style={{ opacity: 0.5 }}>|</span> {record.grade}</td>
                          <td>{record.arrival_date}</td>
                          <td style={{ color: '#14532d' }}>₹{record.min_price}</td>
                          <td style={{ color: '#7f1d1d' }}>₹{record.max_price}</td>
                          <td className="mr-table-price">₹{record.modal_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </Container>
      </div>

      <Footer />
    </div>
  );
}

export default MarketRate;