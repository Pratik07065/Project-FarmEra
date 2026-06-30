import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavScrollExample from '../navbar';
import Footer from '../common/footer';

/* ═══════════════════════════════════════════════════════════════
   STYLES — injected once as a <style> tag
═══════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .yp-page {
    background: linear-gradient(160deg, #f0faf0 0%, #e8f5e2 50%, #f5faf0 100%);
    min-height: 100vh;
    font-family: 'Nunito', sans-serif;
  }

  /* ── Floating leaves background ── */
  .yp-bg { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .yp-leaf { position: absolute; opacity: 0.10; animation: floatLeaf linear infinite; }
  .yp-leaf svg { width: 100%; height: 100%; fill: #2d7a2d; }
  @keyframes floatLeaf {
    0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.10; }
    90%  { opacity: 0.10; }
    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  .yp-content { position: relative; z-index: 1; }

  /* ── Hero ── */
  .yp-hero { text-align: center; padding: 2.5rem 1rem 1.5rem; animation: fadeSlideDown 0.7s ease both; }
  .yp-hero-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 64px; height: 64px;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    border-radius: 20px; margin-bottom: 14px;
    box-shadow: 0 8px 24px rgba(58,125,68,0.28);
    animation: popIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.3s both;
  }
  .yp-hero-title { font-size: 2rem; font-weight: 800; color: #1b4332; margin-bottom: 6px; letter-spacing: -0.5px; }
  .yp-hero-sub { font-size: 0.95rem; color: #52796f; font-weight: 600; }

  /* ── Wizard container ── */
  .yp-wizard-wrap { max-width: 640px; margin: 0 auto; padding: 0 1rem 4rem; }

  /* ── Step nav ── */
  .yp-steps { display: flex; align-items: center; margin-bottom: 1.5rem; }
  .yp-step-item {
    display: flex; flex-direction: column; align-items: center;
    flex: 1; position: relative; cursor: pointer;
  }
  .yp-step-item:not(:last-child)::after {
    content: ''; position: absolute; top: 18px; left: 50%;
    width: 100%; height: 2px; background: #d8f3dc; z-index: 0;
    transition: background 0.4s;
  }
  .yp-step-item.done:not(:last-child)::after { background: #52b788; }
  .yp-step-dot {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid #d8f3dc;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    background: #fff; color: #74c69d; z-index: 1; position: relative;
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .yp-step-item.active .yp-step-dot {
    border-color: #3a7d44; color: #3a7d44;
    transform: scale(1.18); box-shadow: 0 0 0 7px rgba(58,125,68,.12);
  }
  .yp-step-item.done .yp-step-dot { background: #3a7d44; border-color: #3a7d44; color: #fff; }
  .yp-step-label { font-size: 10px; color: #95d5b2; margin-top: 6px; font-weight: 700; text-align: center; transition: color .3s; white-space: nowrap; }
  .yp-step-item.active .yp-step-label { color: #3a7d44; }
  .yp-step-item.done .yp-step-label { color: #52b788; }

  /* ── Progress bar ── */
  .yp-prog-wrap { margin-bottom: 1.5rem; }
  .yp-prog-bg { height: 5px; border-radius: 3px; background: #d8f3dc; overflow: hidden; }
  .yp-prog-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #52b788, #3a7d44); transition: width 0.5s cubic-bezier(.34,1,.64,1); }
  .yp-prog-text { font-size: 11px; color: #74c69d; text-align: right; margin-top: 4px; font-weight: 700; }

  /* ── Card ── */
  .yp-card {
    background: #fff; border-radius: 24px; padding: 2rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 16px 48px rgba(58,125,68,0.10);
    position: relative; overflow: hidden;
    animation: fadeSlideUp 0.5s ease both;
  }
  .yp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg,#3a7d44,#52b788,#95d5b2,#52b788,#3a7d44);
    background-size: 200%;
    animation: shimmerBar 3s linear infinite;
  }
  @keyframes shimmerBar { 0% { background-position: 0% } 100% { background-position: 200% } }

  /* ── Section heading ── */
  .yp-sec-head {
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
    color: #52796f; margin-bottom: 1.25rem; padding-bottom: 10px;
    border-bottom: 1.5px dashed #d8f3dc;
  }
  .yp-sec-head-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, #d8f3dc, #b7e4c7);
    display: flex; align-items: center; justify-content: center; font-size: 15px;
  }

  /* ── Form grid ── */
  .yp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .yp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }

  /* ── Field wrapper ── */
  .yp-field { display: flex; flex-direction: column; gap: 5px; opacity: 0; transform: translateY(10px); transition: opacity .4s, transform .4s; }
  .yp-field.yp-visible { opacity: 1; transform: translateY(0); }
  .yp-label { font-size: 12px; font-weight: 800; color: #2d6a4f; display: flex; align-items: center; gap: 5px; }
  .yp-req { color: #e63946; }

  /* ── Text / number / date inputs ── */
  .yp-inp-wrap { position: relative; }
  .yp-inp-wrap input[type=text],
  .yp-inp-wrap input[type=number],
  .yp-inp-wrap input[type=date] {
    width: 100%; padding: 10px 36px 10px 12px;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600; color: #1b4332;
    border: 1.5px solid #b7e4c7; border-radius: 12px; background: #f8fffe; outline: none;
    transition: border-color .25s, box-shadow .25s, transform .2s, background .25s;
  }
  .yp-inp-wrap input:focus {
    border-color: #3a7d44; box-shadow: 0 0 0 4px rgba(58,125,68,.12);
    transform: translateY(-2px); background: #fff;
  }
  .yp-inp-wrap input:hover:not(:focus) { border-color: #74c69d; background: #f0faf4; }
  .yp-inp-wrap input::placeholder { color: #adb5bd; font-weight: 400; }
  .yp-valid-check {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    color: #3a7d44; font-size: 15px; opacity: 0; transition: opacity .2s;
  }
  .yp-valid-check.show { opacity: 1; }

  /* ── Soil buttons ── */
  .yp-soil-grid { display: flex; gap: 8px; }
  .yp-soil-btn {
    flex: 1; padding: 10px 6px; border: 1.5px solid #d8f3dc; border-radius: 12px;
    background: #f8fffe; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
    color: #52796f; cursor: pointer; transition: all .2s;
    display: flex; flex-direction: column; align-items: center; gap: 5px;
  }
  .yp-soil-btn:hover { transform: translateY(-2px); border-color: #74c69d; background: #f0faf4; }
  .yp-soil-btn.sel { border-color: #3a7d44; background: #f0faf4; color: #1b4332; }
  .yp-soil-dot { width: 22px; height: 22px; border-radius: 50%; }

  /* ── NPK Sliders ── */
  .yp-npk-row { display: flex; flex-direction: column; gap: 4px; }
  .yp-slider-row { display: flex; align-items: center; gap: 8px; }
  .yp-slider-edge { font-size: 11px; color: #95d5b2; font-weight: 700; }
  .yp-npk-val { font-size: 20px; font-weight: 800; color: #3a7d44; min-width: 42px; text-align: right; }
  .yp-npk-badge { display: inline-flex; width: 22px; height: 22px; border-radius: 6px; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
  .n-badge { background: #d8f3dc; color: #1b4332; }
  .p-badge { background: #b7e4c7; color: #0f5132; }
  .k-badge { background: #95d5b2; color: #155724; }

  input[type=range] {
    -webkit-appearance: none; flex: 1; height: 6px; border-radius: 3px; cursor: pointer;
    background: linear-gradient(to right, #52b788 var(--pct,40%), #d8f3dc var(--pct,40%));
    border: none; outline: none; padding: 0;
    transition: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
    background: #3a7d44; cursor: pointer; border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(58,125,68,.30);
    transition: transform .15s, box-shadow .15s;
  }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.3); box-shadow: 0 0 0 7px rgba(58,125,68,.15); }

  /* ── Duration bar ── */
  .yp-dur-display { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
  .yp-dur-bar-wrap { flex: 1; height: 8px; border-radius: 4px; background: #d8f3dc; overflow: hidden; }
  .yp-dur-bar { height: 100%; border-radius: 4px; background: linear-gradient(90deg,#52b788,#3a7d44); transition: width .4s cubic-bezier(.34,1,.64,1); }
  .yp-dur-label { font-size: 13px; font-weight: 800; color: #1b4332; min-width: 60px; }

  /* ── Season buttons ── */
  .yp-season-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
  .yp-season-btn {
    padding: 12px 6px; border: 1.5px solid #d8f3dc; border-radius: 12px;
    background: #f8fffe; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
    color: #52796f; cursor: pointer; transition: all .2s; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .yp-season-btn:hover { border-color: #74c69d; background: #f0faf4; transform: translateY(-2px); }
  .yp-season-btn.sel { border-color: #3a7d44; background: #f0faf4; color: #1b4332; }
  .yp-season-emoji { font-size: 22px; }

  /* ── Urea toggle ── */
  .yp-toggle-row { display: flex; gap: 8px; }
  .yp-toggle-btn {
    flex: 1; padding: 12px; border: 1.5px solid #d8f3dc; border-radius: 12px;
    background: #f8fffe; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
    color: #52796f; cursor: pointer; transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .yp-toggle-btn:hover { border-color: #74c69d; background: #f0faf4; }
  .yp-toggle-btn.sel-yes { border-color: #3a7d44; background: #f0faf4; color: #1b4332; }
  .yp-toggle-btn.sel-no  { border-color: #e63946; background: #fff5f5; color: #e63946; }

  /* ── Divider ── */
  .yp-divider { border: none; border-top: 1.5px dashed #d8f3dc; margin: 1.25rem 0; }

  /* ── Nav buttons ── */
  .yp-nav-row { display: flex; gap: 10px; margin-top: 1.75rem; }
  .yp-btn-back {
    flex: 1; padding: 12px; border: 1.5px solid #d8f3dc; border-radius: 14px;
    background: transparent; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    color: #52796f; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .yp-btn-back:hover { background: #f0faf4; border-color: #74c69d; }
  .yp-btn-next {
    flex: 2; padding: 12px; border: none; border-radius: 14px;
    background: linear-gradient(135deg,#3a7d44,#52b788); font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; color: #fff; cursor: pointer;
    transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 6px;
    position: relative; overflow: hidden; box-shadow: 0 4px 18px rgba(58,125,68,.30);
  }
  .yp-btn-next:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 8px 26px rgba(58,125,68,.40); filter: brightness(1.05); }
  .yp-btn-next:not(:disabled):active { transform: scale(.98); }
  .yp-btn-next:disabled { background: linear-gradient(135deg,#a8d5b5,#b7e4c7); box-shadow: none; cursor: not-allowed; }
  .yp-pulse-ring {
    position: absolute; inset: -4px; border-radius: 18px;
    border: 2px solid rgba(82,183,136,.5);
    animation: pulseRing 1.8s ease-out infinite; pointer-events: none;
  }
  @keyframes pulseRing { 0% { transform:scale(1); opacity:.7; } 100% { transform:scale(1.07); opacity:0; } }

  /* ── Panel transitions ── */
  .yp-panel { animation: fadeSlideUp 0.35s ease both; }
  .yp-panel-exit { animation: fadeSlideLeft 0.25s ease both; }
  @keyframes fadeSlideLeft { to { opacity:0; transform:translateX(-20px); } }

  /* ── Loading dots ── */
  .yp-loading-wrap { display:flex; flex-direction:column; align-items:center; padding: 2rem 0; gap: 1rem; }
  .yp-loading-text { font-size: 14px; font-weight: 700; color: #52796f; }
  .yp-dots { display:flex; gap:6px; }
  .yp-dot { width:10px; height:10px; border-radius:50%; background:#52b788; animation:dotBounce .9s infinite ease-in-out; }
  .yp-dot:nth-child(2) { animation-delay:.15s; }
  .yp-dot:nth-child(3) { animation-delay:.30s; }
  @keyframes dotBounce { 0%,80%,100%{transform:scale(.6);opacity:.6} 40%{transform:scale(1);opacity:1} }

  /* ── Result card ── */
  .yp-result-card {
    border-radius: 20px; border: 2px solid #95d5b2;
    background: linear-gradient(135deg,#f0faf4,#e8f5e2);
    box-shadow: 0 8px 32px rgba(58,125,68,.15);
    padding: 2rem; text-align: center; margin-top: 1rem;
    animation: resultPop 0.6s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes resultPop { from{opacity:0;transform:scale(.9) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .yp-result-icon {
    display:inline-flex; align-items:center; justify-content:center;
    width:56px; height:56px; border-radius:50%;
    background:linear-gradient(135deg,#3a7d44,#52b788); margin:0 auto 12px;
    box-shadow:0 4px 16px rgba(58,125,68,.35);
    animation: spinIn 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both;
  }
  @keyframes spinIn { from{opacity:0;transform:rotate(-180deg) scale(0)} to{opacity:1;transform:rotate(0) scale(1)} }
  .yp-result-num { font-size: 3.2rem; font-weight: 800; color: #1b4332; line-height: 1; animation:countFade .5s ease .2s both; }
  @keyframes countFade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .yp-result-unit { font-size: 14px; color: #74c69d; font-weight: 700; margin-top: 4px; }
  .yp-result-heading { font-size: 13px; font-weight: 700; color: #52796f; margin-bottom: 8px; }
  .yp-meta-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:1.25rem; }
  .yp-meta-chip { background:#fff; border:1px solid #d8f3dc; border-radius:12px; padding:10px 8px; text-align:center; }
  .yp-meta-val { font-size:13px; font-weight:800; color:#1b4332; display:block; margin-bottom:2px; }
  .yp-meta-key { font-size:11px; color:#74c69d; font-weight:700; }

  /* ── Summary ── */
  .yp-summary { background:#f0faf4; border-radius:14px; padding:1rem 1.25rem; margin-bottom:1rem; }
  .yp-summary-title { font-size:11px; font-weight:800; color:#52796f; text-transform:uppercase; letter-spacing:.08em; margin-bottom:.75rem; }
  .yp-summary-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px 16px; }
  .yp-sum-row { display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed #d8f3dc; font-size:12px; }
  .yp-sum-row:last-child { border-bottom:none; }
  .yp-sum-key { color:#52796f; font-weight:600; }
  .yp-sum-val { font-weight:800; color:#1b4332; }

  /* ── Error alert ── */
  .yp-error {
    background:#fff5f5; border:1.5px solid #ffc9c9; border-radius:14px;
    padding:14px 16px; font-size:13px; font-weight:700; color:#e63946;
    display:flex; align-items:center; gap:10px; margin-top:1rem;
    animation: shake 0.5s ease both;
    box-shadow: 0 4px 16px rgba(230,57,70,.12);
  }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }

  /* ── Keyframes ── */
  @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeSlideUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes popIn { from{opacity:0;transform:scale(.5) rotate(-10deg)} to{opacity:1;transform:scale(1) rotate(0)} }

  /* ── Reset button ── */
  .yp-reset-btn {
    width:100%; margin-top:1rem; padding:12px; border:1.5px solid #b7e4c7; border-radius:14px;
    background:#fff; font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; color:#3a7d44;
    cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .yp-reset-btn:hover { background:#f0faf4; border-color:#3a7d44; transform:translateY(-2px); }
`;

/* ── Leaf SVG ── */
const LEAF_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z"/>
</svg>`;

/* ── Floating leaves ── */
const FloatingLeaves = () => {
  const leaves = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left:     `${8 + i * 9}%`,
    size:     `${16 + (i % 4) * 6}px`,
    duration: `${12 + (i % 5) * 4}s`,
    delay:    `${i * 1.8}s`,
  }));
  return (
    <div className="yp-bg">
      {leaves.map(l => (
        <div
          key={l.id}
          className="yp-leaf"
          style={{ left: l.left, width: l.size, height: l.size, animationDuration: l.duration, animationDelay: l.delay }}
          dangerouslySetInnerHTML={{ __html: LEAF_SVG }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STEP CONFIG
═══════════════════════════════════════════════════════════════ */
const STEPS = [
  { label: 'Location', emoji: '📍' },
  { label: 'Nutrients', emoji: '🌱' },
  { label: 'Season',   emoji: '📅' },
  { label: 'Crop',     emoji: '🌾' },
  { label: 'Result',   emoji: '📊' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const YieldPredictor = () => {

  /* ── State ── */
  const [step, setStep]     = useState(1);
  const [animKey, setAnimKey] = useState(0); // forces re-mount animation on step change

  const [formData, setFormData] = useState({
    Taluka:        '',
    soil_type:     '',
    season:        '',
    date_of_sowing:'',
    urea:          '',
    crop_duration: 120,
    Nitrogen:      80,
    Phosphorus:    40,
    Potassium:     40,
  });

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const resultRef = useRef(null);
  const [displayNum, setDisplayNum] = useState(0);

  /* ── Inject CSS ── */
  useEffect(() => {
    const id = 'yp-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => { const t = document.getElementById(id); if (t) t.remove(); };
  }, []);

  /* ── Animated count-up for result ── */
  useEffect(() => {
    if (result == null) return;
    const target = parseFloat(result);
    if (isNaN(target)) { setDisplayNum(result); return; }
    let current = 0;
    const stepSize = target / 50;
    const iv = setInterval(() => {
      current = Math.min(current + stepSize, target);
      setDisplayNum(current.toFixed(2));
      if (current >= target) clearInterval(iv);
    }, 25);
    return () => clearInterval(iv);
  }, [result]);

  /* ── Scroll to result ── */
  useEffect(() => {
    if ((result || error) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result, error]);

  /* ── Helpers ── */
  const goTo = (n) => { setAnimKey(k => k + 1); setStep(n); };

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  /* ── Step 1 valid? ── */
  const step1Valid = formData.Taluka.trim() !== '' && formData.soil_type !== '';

  /* ── Step 3 valid? ── */
  const step3Valid = formData.season !== '' && formData.date_of_sowing !== '';

  /* ── Step 4 valid? ── */
  const step4Valid = formData.urea !== '';

  /* ── Submit ── */
  const handleSubmit = async () => {
    goTo(5);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict_yield', formData);
      if (response.data.success) {
        setResult(response.data.predicted_yield);
      } else {
        setError(response.data.error || 'Prediction failed.');
      }
    } catch (err) {
      setError('Could not connect to the backend. Please ensure the Flask server is running.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setFormData({
      Taluka: '', soil_type: '', season: '', date_of_sowing: '',
      urea: '', crop_duration: 120, Nitrogen: 80, Phosphorus: 40, Potassium: 40,
    });
    setResult(null);
    setError(null);
    setDisplayNum(0);
    goTo(1);
  };

  /* ── NPK slider update ── */
  const updSlider = (field, val, max) => {
    handleChange(field, parseInt(val));
    // update CSS variable for track fill
    const pct = Math.round((val / max) * 100);
    document.getElementById(`sl-${field.toLowerCase()}`)?.style.setProperty('--pct', pct + '%');
  };

  /* ── Duration slider update ── */
  const updDur = (val) => {
    const num = parseInt(val);
    handleChange('crop_duration', num);
    document.getElementById('sl-dur')?.style.setProperty('--pct', Math.round(((num - 60) / 120) * 100) + '%');
  };

  /* ── Progress ── */
  const progPct = Math.max(Math.round(((step - 1) / 4) * 100), 5);

  /* ── Summary rows ── */
  const summaryRows = [
    ['Taluka',       formData.Taluka],
    ['Soil type',    formData.soil_type],
    ['Season',       formData.season],
    ['Sowing date',  formData.date_of_sowing],
    ['Duration',     formData.crop_duration + ' days'],
    ['Urea',         formData.urea],
    ['Nitrogen',     formData.Nitrogen + ' kg/ha'],
    ['Phosphorus',   formData.Phosphorus + ' kg/ha'],
    ['Potassium',    formData.Potassium + ' kg/ha'],
  ];

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <div className="yp-page">
      <NavScrollExample />
      <FloatingLeaves />

      <div className="yp-content">

        {/* Hero */}
        <div className="yp-hero">
          <div className="yp-hero-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z" fill="white"/>
            </svg>
          </div>
          <h1 className="yp-hero-title">Onion Yield Prediction</h1>
          <p className="yp-hero-sub">AI-powered estimate for your farm's production</p>
        </div>

        <div className="yp-wizard-wrap">

          {/* Step nav */}
          <div className="yp-steps">
            {STEPS.map((s, i) => {
              const num = i + 1;
              const cls = step > num ? 'yp-step-item done' : step === num ? 'yp-step-item active' : 'yp-step-item';
              return (
                <div key={num} className={cls}>
                  <div className="yp-step-dot">
                    {step > num ? '✓' : s.emoji}
                  </div>
                  <span className="yp-step-label">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="yp-prog-wrap">
            <div className="yp-prog-bg">
              <div className="yp-prog-fill" style={{ width: progPct + '%' }} />
            </div>
            <div className="yp-prog-text">
              {step <= 4 ? `Step ${step} of 4` : 'Complete'}
            </div>
          </div>

          {/* Card */}
          <div className="yp-card">

            {/* ── STEP 1: Location & Soil ── */}
            {step === 1 && (
              <div className="yp-panel" key={`p1-${animKey}`}>
                <div className="yp-sec-head">
                  <span className="yp-sec-head-icon">📍</span>
                  Location &amp; Soil Type
                </div>

                <div className="yp-grid-2" style={{ marginBottom: '1.25rem' }}>

                  {/* Taluka */}
                  <div className="yp-field yp-visible">
                    <label className="yp-label">Taluka <span className="yp-req">*</span></label>
                    <div className="yp-inp-wrap">
                      <input
                        type="text"
                        placeholder="e.g. Yeola"
                        value={formData.Taluka}
                        onChange={e => handleChange('Taluka', e.target.value)}
                        autoComplete="off"
                      />
                      <span className={`yp-valid-check${formData.Taluka.trim() ? ' show' : ''}`}>✓</span>
                    </div>
                  </div>

                  {/* Soil type */}
                  <div className="yp-field yp-visible">
                    <label className="yp-label">Soil Type <span className="yp-req">*</span></label>
                    <div className="yp-soil-grid">
                      {[
                        { val: 'Black', color: '#2c1810' },
                        { val: 'Red',   color: '#c0392b' },
                        { val: 'Silt',  color: '#d4a96a' },
                      ].map(s => (
                        <button
                          key={s.val}
                          type="button"
                          className={`yp-soil-btn${formData.soil_type === s.val ? ' sel' : ''}`}
                          onClick={() => handleChange('soil_type', s.val)}
                        >
                          <span className="yp-soil-dot" style={{ background: s.color }} />
                          {s.val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="yp-nav-row">
                  <div style={{ position: 'relative', flex: 2 }}>
                    {!loading && step1Valid && <div className="yp-pulse-ring" />}
                    <button
                      type="button"
                      className="yp-btn-next"
                      style={{ width: '100%' }}
                      disabled={!step1Valid}
                      onClick={() => goTo(2)}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Nutrients ── */}
            {step === 2 && (
              <div className="yp-panel" key={`p2-${animKey}`}>
                <div className="yp-sec-head">
                  <span className="yp-sec-head-icon">🌱</span>
                  Soil Nutrients (NPK)
                </div>

                {[
                  { key: 'Nitrogen',   id: 'sl-Nitrogen',   badge: 'N', cls: 'n-badge', max: 200 },
                  { key: 'Phosphorus', id: 'sl-Phosphorus', badge: 'P', cls: 'p-badge', max: 150 },
                  { key: 'Potassium',  id: 'sl-Potassium',  badge: 'K', cls: 'k-badge', max: 150 },
                ].map(({ key, id, badge, cls, max }) => (
                  <div className="yp-field yp-visible" key={key} style={{ marginBottom: '1.25rem' }}>
                    <label className="yp-label">
                      <span className={`yp-npk-badge ${cls}`}>{badge}</span>
                      {key} (kg/ha)
                    </label>
                    <div className="yp-npk-row">
                      <div className="yp-slider-row">
                        <span className="yp-slider-edge">0</span>
                        <input
                          type="range" id={id} min="0" max={max}
                          value={formData[key]}
                          style={{ '--pct': Math.round((formData[key] / max) * 100) + '%' }}
                          onChange={e => updSlider(key, e.target.value, max)}
                        />
                        <span className="yp-slider-edge">{max}</span>
                        <span className="yp-npk-val">{formData[key]}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="yp-nav-row">
                  <button type="button" className="yp-btn-back" onClick={() => goTo(1)}>← Back</button>
                  <button type="button" className="yp-btn-next" onClick={() => goTo(3)}>Next →</button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Season & Date ── */}
            {step === 3 && (
              <div className="yp-panel" key={`p3-${animKey}`}>
                <div className="yp-sec-head">
                  <span className="yp-sec-head-icon">📅</span>
                  Season &amp; Sowing Date
                </div>

                <div className="yp-field yp-visible" style={{ marginBottom: '1.25rem' }}>
                  <label className="yp-label">Season <span className="yp-req">*</span></label>
                  <div className="yp-season-grid" style={{ marginTop: '4px' }}>
                    {[
                      { val: 'Kharif',      emoji: '☀️' },
                      { val: 'Late Kharif', emoji: '⛅' },
                      { val: 'Rabi',        emoji: '❄️' },
                    ].map(s => (
                      <button
                        key={s.val}
                        type="button"
                        className={`yp-season-btn${formData.season === s.val ? ' sel' : ''}`}
                        onClick={() => handleChange('season', s.val)}
                      >
                        <span className="yp-season-emoji">{s.emoji}</span>
                        {s.val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="yp-field yp-visible" style={{ marginBottom: '0.5rem' }}>
                  <label className="yp-label">Date of Sowing <span className="yp-req">*</span></label>
                  <div className="yp-inp-wrap">
                    <input
                      type="date"
                      value={formData.date_of_sowing}
                      onChange={e => handleChange('date_of_sowing', e.target.value)}
                    />
                    <span className={`yp-valid-check${formData.date_of_sowing ? ' show' : ''}`}>✓</span>
                  </div>
                </div>

                <div className="yp-nav-row">
                  <button type="button" className="yp-btn-back" onClick={() => goTo(2)}>← Back</button>
                  <button
                    type="button"
                    className="yp-btn-next"
                    disabled={!step3Valid}
                    onClick={() => goTo(4)}
                  >Next →</button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Crop Details ── */}
            {step === 4 && (
              <div className="yp-panel" key={`p4-${animKey}`}>
                <div className="yp-sec-head">
                  <span className="yp-sec-head-icon">🌾</span>
                  Crop Details
                </div>

                {/* Duration slider */}
                <div className="yp-field yp-visible" style={{ marginBottom: '1.5rem' }}>
                  <label className="yp-label">⏳ Crop Duration <span className="yp-req">*</span></label>
                  <div className="yp-slider-row" style={{ marginTop: '6px' }}>
                    <span className="yp-slider-edge">60</span>
                    <input
                      type="range" id="sl-dur" min="60" max="180"
                      value={formData.crop_duration}
                      style={{ '--pct': Math.round(((formData.crop_duration - 60) / 120) * 100) + '%' }}
                      onChange={e => updDur(e.target.value)}
                    />
                    <span className="yp-slider-edge">180</span>
                  </div>
                  <div className="yp-dur-display">
                    <div className="yp-dur-bar-wrap">
                      <div
                        className="yp-dur-bar"
                        style={{ width: Math.round(((formData.crop_duration - 60) / 120) * 100) + '%' }}
                      />
                    </div>
                    <span className="yp-dur-label">
                      <strong>{formData.crop_duration}</strong> days
                    </span>
                  </div>
                </div>

                <hr className="yp-divider" />

                {/* Urea toggle */}
                <div className="yp-field yp-visible" style={{ marginBottom: '0.5rem' }}>
                  <label className="yp-label">🌾 Urea Applied? <span className="yp-req">*</span></label>
                  <div className="yp-toggle-row" style={{ marginTop: '6px' }}>
                    <button
                      type="button"
                      className={`yp-toggle-btn${formData.urea === 'yes' ? ' sel-yes' : ''}`}
                      onClick={() => handleChange('urea', 'yes')}
                    >✓ Yes</button>
                    <button
                      type="button"
                      className={`yp-toggle-btn${formData.urea === 'no' ? ' sel-no' : ''}`}
                      onClick={() => handleChange('urea', 'no')}
                    >✕ No</button>
                  </div>
                </div>

                <div className="yp-nav-row">
                  <button type="button" className="yp-btn-back" onClick={() => goTo(3)}>← Back</button>
                  <div style={{ position: 'relative', flex: 2 }}>
                    {step4Valid && <div className="yp-pulse-ring" />}
                    <button
                      type="button"
                      className="yp-btn-next"
                      style={{ width: '100%' }}
                      disabled={!step4Valid}
                      onClick={handleSubmit}
                    >
                      🌿 Predict Yield
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 5: Result ── */}
            {step === 5 && (
              <div className="yp-panel" key={`p5-${animKey}`} ref={resultRef}>

                {/* Loading */}
                {loading && (
                  <div className="yp-loading-wrap">
                    <div className="yp-loading-text">Analysing your farm data...</div>
                    <div className="yp-dots">
                      <div className="yp-dot" />
                      <div className="yp-dot" />
                      <div className="yp-dot" />
                    </div>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <>
                    <div className="yp-error">⚠️ {error}</div>
                    <button type="button" className="yp-btn-back" style={{ marginTop: '1rem', width: '100%' }} onClick={() => goTo(4)}>
                      ← Go back &amp; retry
                    </button>
                  </>
                )}

                {/* Success */}
                {!loading && result !== null && !error && (
                  <>
                    {/* Input summary */}
                    <div className="yp-summary">
                      <div className="yp-summary-title">Your inputs</div>
                      <div className="yp-summary-grid">
                        {summaryRows.map(([k, v]) => (
                          <div className="yp-sum-row" key={k}>
                            <span className="yp-sum-key">{k}</span>
                            <span className="yp-sum-val">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result */}
                    <div className="yp-result-card">
                      <div className="yp-result-icon">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z" fill="white"/>
                        </svg>
                      </div>
                      <p className="yp-result-heading">Predicted Average Production</p>
                      <div className="yp-result-num">{displayNum}</div>
                      <div className="yp-result-unit">Quintals / Acre</div>

                      <div className="yp-meta-grid">
                        {[
                          { label: 'Soil',     val: formData.soil_type },
                          { label: 'Season',   val: formData.season },
                          { label: 'Duration', val: formData.crop_duration + ' days' },
                        ].map(m => (
                          <div className="yp-meta-chip" key={m.label}>
                            <span className="yp-meta-val">{m.val}</span>
                            <span className="yp-meta-key">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="button" className="yp-reset-btn" onClick={handleReset}>
                      🔄 New Prediction
                    </button>
                  </>
                )}

              </div>
            )}

          </div>{/* /card */}
        </div>{/* /wizard-wrap */}
      </div>{/* /content */}

      <Footer />
    </div>
  );
};

export default YieldPredictor;