import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavScrollExample from '../navbar';
import Footer from '../common/footer';

/* ═══════════════════════════════════════════════════════════════
   STYLES — injected once as a <style> tag, cleaned up on unmount
═══════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  /* ── Page (Updated to match YieldPredictor light theme) ── */
  .pp-page {
    background: linear-gradient(160deg, #f0faf0 0%, #e8f5e2 50%, #f5faf0 100%);
    min-height: 100vh;
    font-family: 'Nunito', sans-serif;
    position: relative;
  }

  /* ── Floating leaves background ── */
  .pp-bg { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .pp-leaf { position: absolute; opacity: 0.10; animation: floatLeaf linear infinite; }
  .pp-leaf svg { width: 100%; height: 100%; fill: #2d7a2d; }
  @keyframes floatLeaf {
    0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.10; }
    90%  { opacity: 0.10; }
    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  .pp-content { position: relative; z-index: 1; }

  /* ── Hero ── */
  .pp-hero {
    text-align: center; padding: 2.5rem 1rem 1.5rem;
    animation: ppFadeDown 0.7s ease both;
  }
  .pp-hero-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 68px; height: 68px;
    background: linear-gradient(135deg, #52b788, #3a7d44);
    border-radius: 22px; margin-bottom: 16px;
    box-shadow: 0 0 0 8px rgba(82,183,136,.12), 0 16px 40px rgba(82,183,136,.25);
    animation: ppPopIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.3s both;
  }
  .pp-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem; font-weight: 400; 
    color: #1b4332; /* Updated for light background visibility */
    margin-bottom: 6px; letter-spacing: -0.5px;
  }
  .pp-hero-sub { 
    font-size: 0.9rem; 
    color: #52796f; /* Updated for light background visibility */
    font-weight: 600; 
  }

  /* ── Live badge ── */
  .pp-live-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(82,183,136,.12); border: 1px solid rgba(82,183,136,.25);
    color: #3a7d44; font-size: 0.78rem; font-weight: 800;
    padding: 6px 16px; border-radius: 20px; margin-bottom: 1.5rem;
    letter-spacing: .05em; text-transform: uppercase;
  }
  .pp-live-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #3a7d44;
    animation: ppPulse 1.5s ease infinite;
  }
  @keyframes ppPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.5)} }

  /* ── Wizard container ── */
  .pp-wizard { max-width: 580px; margin: 0 auto; padding: 0 1rem 5rem; }

  /* ── Steps nav ── */
  .pp-steps { display: flex; align-items: center; margin-bottom: 1.5rem; }
  .pp-step-item {
    display: flex; flex-direction: column; align-items: center;
    flex: 1; position: relative; cursor: pointer;
  }
  .pp-step-item:not(:last-child)::after {
    content: ''; position: absolute; top: 18px; left: 50%;
    width: 100%; height: 2px; background: rgba(82,183,136,.4); z-index: 0; transition: background .4s;
  }
  .pp-step-item.done:not(:last-child)::after { background: #52b788; }
  .pp-step-dot {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid rgba(82,183,136,.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; background: #fff;
    color: rgba(82,183,136,.8); z-index: 1; position: relative;
    transition: all .3s cubic-bezier(.34,1.56,.64,1);
  }
  .pp-step-item.active .pp-step-dot {
    border-color: #52b788; color: #52b788;
    transform: scale(1.18); box-shadow: 0 0 0 7px rgba(82,183,136,.12);
    background: rgba(82,183,136,.1);
  }
  .pp-step-item.done .pp-step-dot {
    background: #3a7d44; border-color: #3a7d44; color: #fff;
  }
  .pp-step-label { font-size: 10px; color: #74c69d; margin-top: 6px; font-weight: 700; text-align: center; transition: color .3s; white-space: nowrap; }
  .pp-step-item.active .pp-step-label { color: #3a7d44; }
  .pp-step-item.done .pp-step-label { color: #52b788; }

  /* ── Progress bar ── */
  .pp-prog-wrap { margin-bottom: 1.5rem; }
  .pp-prog-bg { height: 4px; border-radius: 2px; background: rgba(82,183,136,.25); overflow: hidden; }
  .pp-prog-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, #52b788, #95d5b2);
    transition: width .5s cubic-bezier(.34,1,.64,1);
    box-shadow: 0 0 10px rgba(82,183,136,.5);
  }
  .pp-prog-text { font-size: 11px; color: #52796f; text-align: right; margin-top: 4px; font-weight: 700; }

  /* ── Card (Kept dark for awesome contrast) ── */
  .pp-card {
    background: rgba(18, 38, 24, 0.90);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(82,183,136,.18);
    border-radius: 24px; padding: 2rem;
    box-shadow: 0 0 0 1px rgba(82,183,136,.05), 0 24px 64px rgba(58,125,68,0.20);
    position: relative; overflow: hidden;
    animation: ppFadeUp 0.4s ease both;
  }
  .pp-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,#3a7d44,#52b788,#95d5b2,#52b788,#3a7d44);
    background-size: 200%;
    animation: ppShimmer 3s linear infinite;
  }
  @keyframes ppShimmer { 0%{background-position:0%} 100%{background-position:200%} }

  /* ── Section heading ── */
  .pp-sec-head {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(82,183,136,.7); margin-bottom: 1.25rem; padding-bottom: 10px;
    border-bottom: 1px solid rgba(82,183,136,.1);
  }
  .pp-sec-icon {
    width: 26px; height: 26px; border-radius: 7px;
    background: rgba(82,183,136,.1); border: 1px solid rgba(82,183,136,.15);
    display: flex; align-items: center; justify-content: center; font-size: 13px;
  }

  /* ── Label ── */
  .pp-label {
    font-size: 11px; font-weight: 800; color: rgba(82,183,136,.7);
    text-transform: uppercase; letter-spacing: .06em;
    margin-bottom: 6px; display: flex; align-items: center; gap: 5px;
  }
  .pp-req { color: #e63946; }

  /* ── Grid ── */
  .pp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  /* ── Field ── */
  .pp-field { display: flex; flex-direction: column; gap: 5px; opacity: 0; transform: translateY(8px); transition: opacity .4s, transform .4s; }
  .pp-field.pp-vis { opacity: 1; transform: translateY(0); }

  /* ── Input ── */
  .pp-inp-wrap { position: relative; }
  .pp-inp-wrap input[type=text],
  .pp-inp-wrap input[type=date] {
    width: 100%; padding: 11px 38px 11px 14px;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600;
    color: #e8f5e2; background: rgba(82,183,136,.06);
    border: 1.5px solid rgba(82,183,136,.18); border-radius: 12px; outline: none;
    transition: border-color .25s, box-shadow .25s, transform .2s, background .25s;
    caret-color: #52b788;
  }
  .pp-inp-wrap input:focus {
    border-color: #52b788; background: rgba(82,183,136,.1);
    box-shadow: 0 0 0 4px rgba(82,183,136,.12); transform: translateY(-2px);
  }
  .pp-inp-wrap input:hover:not(:focus) {
    border-color: rgba(82,183,136,.35); background: rgba(82,183,136,.08);
  }
  .pp-inp-wrap input::placeholder { color: rgba(82,183,136,.3); font-weight: 400; }
  .pp-inp-wrap input[type=date]::-webkit-calendar-picker-indicator { filter: invert(.5) sepia(1) saturate(2) hue-rotate(100deg); cursor: pointer; }
  .pp-valid-check {
    position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
    color: #52b788; font-size: 14px; opacity: 0; transition: opacity .2s;
  }
  .pp-valid-check.show { opacity: 1; }

  /* ── Select ── */
  .pp-select-grid { display: flex; gap: 8px; flex-wrap: wrap; }
  .pp-select-btn {
    flex: 1; min-width: 80px; padding: 11px 8px;
    border: 1.5px solid rgba(82,183,136,.18); border-radius: 12px;
    background: rgba(82,183,136,.05); font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 700; color: rgba(82,183,136,.55);
    cursor: pointer; transition: all .2s; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .pp-select-btn:hover { border-color: rgba(82,183,136,.4); background: rgba(82,183,136,.1); transform: translateY(-2px); }
  .pp-select-btn.sel { border-color: #52b788; background: rgba(82,183,136,.15); color: #95d5b2; }
  .pp-select-btn .pp-sb-emoji { font-size: 18px; }

  /* ── Divider ── */
  .pp-divider { border: none; border-top: 1px solid rgba(82,183,136,.1); margin: 1.25rem 0; }

  /* ── Nav buttons ── */
  .pp-nav-row { display: flex; gap: 10px; margin-top: 1.75rem; }
  .pp-btn-back {
    flex: 1; padding: 12px; border: 1.5px solid rgba(82,183,136,.2); border-radius: 14px;
    background: transparent; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
    color: rgba(82,183,136,.6); cursor: pointer; transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .pp-btn-back:hover { background: rgba(82,183,136,.08); border-color: rgba(82,183,136,.35); color: #52b788; }

  .pp-btn-next {
    flex: 2; padding: 12px; border: none; border-radius: 14px;
    background: linear-gradient(135deg,#2d6a4f,#52b788); font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; color: #fff; cursor: pointer;
    transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 6px;
    position: relative; overflow: hidden;
    box-shadow: 0 4px 20px rgba(82,183,136,.3);
  }
  .pp-btn-next:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(82,183,136,.45); filter: brightness(1.08); }
  .pp-btn-next:not(:disabled):active { transform: scale(.98); }
  .pp-btn-next:disabled { background: linear-gradient(135deg,rgba(58,125,68,.3),rgba(82,183,136,.3)); box-shadow: none; cursor: not-allowed; color: rgba(255,255,255,.4); }
  .pp-pulse-ring {
    position: absolute; inset: -4px; border-radius: 18px;
    border: 2px solid rgba(82,183,136,.4);
    animation: ppPulseRing 1.8s ease-out infinite; pointer-events: none;
  }
  @keyframes ppPulseRing { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.07);opacity:0} }

  /* ── Panel animation ── */
  .pp-panel { animation: ppFadeUp .35s ease both; }

  /* ── Loading ── */
  .pp-loading-wrap { display:flex; flex-direction:column; align-items:center; padding:2.5rem 0; gap:1rem; }
  .pp-loading-text { font-size:14px; font-weight:700; color:#74c69d; letter-spacing:.05em; }
  .pp-dots { display:flex; gap:7px; }
  .pp-dot { width:10px; height:10px; border-radius:50%; background:#52b788; animation:dotB .9s infinite ease-in-out; }
  .pp-dot:nth-child(2){animation-delay:.15s} .pp-dot:nth-child(3){animation-delay:.3s}
  @keyframes dotB { 0%,80%,100%{transform:scale(.6);opacity:.4} 40%{transform:scale(1);opacity:1} }

  /* ── Error ── */
  .pp-error {
    background: rgba(230,57,70,.1); border: 1.5px solid rgba(230,57,70,.25);
    border-radius: 14px; padding: 14px 16px; font-size: 13px; font-weight: 700;
    color: #ff6b6b; display: flex; align-items: center; gap: 10px; margin-top: 1rem;
    animation: ppShake .5s ease both;
  }
  @keyframes ppShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }

  /* ── Result card ── */
  .pp-result-wrap {
    margin-top: 1rem;
    animation: ppResultPop .6s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes ppResultPop { from{opacity:0;transform:scale(.9) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* ── Result banner ── */
  .pp-res-banner {
    background: linear-gradient(135deg,#1b4332,#2d6a4f);
    border-radius: 20px 20px 0 0;
    padding: 14px 22px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: #95d5b2;
    position: relative; overflow: hidden;
    border: 1px solid rgba(82,183,136,.25); border-bottom: none;
  }
  .pp-res-banner::after {
    content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
    background: rgba(255,255,255,.06); transform: skewX(-20deg);
    animation: ppSheen 2.5s ease-in-out infinite;
  }
  @keyframes ppSheen { 0%{left:-60%} 100%{left:130%} }

  /* ── Price grid ── */
  .pp-price-grid {
    background: rgba(18,38,24,.95); border: 1px solid rgba(82,183,136,.18);
    border-top: none; border-radius: 0 0 20px 20px;
    display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr;
    overflow: hidden;
  }
  .pp-price-divider-v { background: rgba(82,183,136,.12); }
  .pp-price-col { text-align: center; padding: 1.75rem 0.5rem; animation: ppPriceIn .5s cubic-bezier(.34,1.56,.64,1) both; }
  .pp-price-col:nth-child(1){animation-delay:.05s} .pp-price-col:nth-child(3){animation-delay:.15s} .pp-price-col:nth-child(5){animation-delay:.25s}
  @keyframes ppPriceIn { from{opacity:0;transform:translateY(14px) scale(.9)} to{opacity:1;transform:translateY(0) scale(1)} }

  .pp-price-label { font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: rgba(82,183,136,.5); margin-bottom: 8px; }
  .pp-price-label.modal { color: #52b788; }

  .pp-price-val { font-family: 'DM Serif Display', serif; font-weight: 400; color: #e8f5e2; line-height: 1; }
  .pp-price-val.side  { font-size: 1.7rem; }
  .pp-price-val.modal {
    font-size: 2.6rem; color: #52b788;
    text-shadow: 0 0 30px rgba(82,183,136,.4);
    animation: ppGlowNum 2s ease-in-out infinite alternate;
  }
  @keyframes ppGlowNum { from{text-shadow:0 0 15px rgba(82,183,136,.3)} to{text-shadow:0 0 35px rgba(82,183,136,.7)} }

  .pp-price-unit { font-size: 10px; color: rgba(82,183,136,.4); font-weight: 700; margin-top: 4px; }

  .pp-modal-glow {
    position: relative; padding: 0.5rem;
  }
  .pp-modal-glow::before {
    content: ''; position: absolute; inset: -2px;
    border-radius: 12px; border: 1px solid rgba(82,183,136,.2);
    animation: ppModalPulse 2s ease-out infinite;
  }
  @keyframes ppModalPulse { 0%,100%{border-color:rgba(82,183,136,.25)} 50%{border-color:rgba(82,183,136,.05)} }

  /* ── Tip strip ── */
  .pp-tip {
    background: rgba(82,183,136,.07); border: 1px solid rgba(82,183,136,.12);
    border-top: none; border-radius: 0 0 20px 20px;
    padding: 10px 20px; text-align: center;
    font-size: 12px; font-weight: 700; color: rgba(82,183,136,.6);
    letter-spacing: .02em;
  }

  /* ── Summary ── */
  .pp-summary {
    background: rgba(82,183,136,.05); border: 1px solid rgba(82,183,136,.1);
    border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1rem;
  }
  .pp-summary-title { font-size: 10px; font-weight: 800; color: rgba(82,183,136,.5); text-transform: uppercase; letter-spacing: .1em; margin-bottom: .75rem; }
  .pp-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
  .pp-sum-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(82,183,136,.08); font-size: 12px; }
  .pp-sum-row:last-child { border-bottom: none; }
  .pp-sum-key { color: rgba(82,183,136,.5); font-weight: 600; }
  .pp-sum-val { font-weight: 800; color: #95d5b2; }

  /* ── Reset button ── */
  .pp-reset-btn {
    width: 100%; margin-top: 1rem; padding: 12px; border: 1.5px solid rgba(82,183,136,.2);
    border-radius: 14px; background: transparent; font-family: 'Nunito', sans-serif;
    font-size: 14px; font-weight: 800; color: #52b788;
    cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .pp-reset-btn:hover { background: rgba(82,183,136,.1); border-color: #52b788; transform: translateY(-2px); }

  /* ── Keyframes ── */
  @keyframes ppFadeDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ppFadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes ppPopIn    { from{opacity:0;transform:scale(.5) rotate(-10deg)} to{opacity:1;transform:scale(1) rotate(0)} }
`;

/* ── Leaf SVG ── */
const LEAF_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z"/>
</svg>`;

/* ── Floating leaves (Replaces Mesh & Coins) ── */
const FloatingLeaves = () => {
  const leaves = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left:     `${8 + i * 9}%`,
    size:     `${16 + (i % 4) * 6}px`,
    duration: `${12 + (i % 5) * 4}s`,
    delay:    `${i * 1.8}s`,
  }));
  return (
    <div className="pp-bg">
      {leaves.map(l => (
        <div
          key={l.id}
          className="pp-leaf"
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
  { label: 'Details',  emoji: '🌾' },
  { label: 'Date',     emoji: '📅' },
  { label: 'Result',   emoji: '📊' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const PricePredictor = () => {

  /* ── State ── */
  const [step, setStep]     = useState(1);
  const [animKey, setAnimKey] = useState(0);

  const [formData, setFormData] = useState({
    State:        '',
    District:     '',
    Market:       '',
    Commodity:    'Onion',
    Variety:      '',
    Grade:        '',
    Arrival_Date: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  /* ── Animated count-up for prices ── */
  const [displayMin,   setDisplayMin]   = useState(0);
  const [displayModal, setDisplayModal] = useState(0);
  const [displayMax,   setDisplayMax]   = useState(0);

  const resultRef = useRef(null);

  /* ── Inject CSS ── */
  useEffect(() => {
    const id = 'pp-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => { const t = document.getElementById(id); if (t) t.remove(); };
  }, []);

  /* ── Count-up animation when prediction arrives ── */
  useEffect(() => {
    if (!prediction) return;
    const animate = (target, setter) => {
      const t = parseFloat(target) || 0;
      let cur = 0; const stepSize = t / 50;
      const iv = setInterval(() => {
        cur = Math.min(cur + stepSize, t);
        setter(Math.round(cur));
        if (cur >= t) clearInterval(iv);
      }, 25);
    };
    animate(prediction.min_price,   setDisplayMin);
    animate(prediction.modal_price, setDisplayModal);
    animate(prediction.max_price,   setDisplayMax);
  }, [prediction]);

  /* ── Scroll to result ── */
  useEffect(() => {
    if ((prediction || error) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [prediction, error]);

  /* ── Helpers ── */
  const goTo = (n) => { setAnimKey(k => k + 1); setStep(n); };
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  /* ── Validation ── */
  const step1Valid = formData.State.trim() && formData.District.trim() && formData.Market.trim();
  const step2Valid = formData.Variety.trim() && formData.Grade.trim();
  const step3Valid = !!formData.Arrival_Date;

  /* ── Submit ── */
  const handleSubmit = async () => {
    goTo(4);
    setLoading(true);
    setError(null);
    setPrediction(null);
    setDisplayMin(0); setDisplayModal(0); setDisplayMax(0);

    const [year, month, day] = formData.Arrival_Date.split('-');
    const payload = { ...formData, Arrival_Date: `${day}-${month}-${year}` };

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', payload);
      setPrediction(response.data);
    } catch (err) {
      console.error('Connection Error:', err);
      setError('Unable to connect to the prediction server. Please ensure the Flask backend is running and CORS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setFormData({ State:'', District:'', Market:'', Commodity:'Onion', Variety:'', Grade:'', Arrival_Date:'' });
    setPrediction(null); setError(null);
    setDisplayMin(0); setDisplayModal(0); setDisplayMax(0);
    goTo(1);
  };

  /* ── Animate panel fields ── */
  useEffect(() => {
    const fields = document.querySelectorAll('.pp-field');
    fields.forEach((f, i) => {
      f.classList.remove('pp-vis');
      f.style.transitionDelay = (i * 0.08) + 's';
      setTimeout(() => f.classList.add('pp-vis'), i * 80 + 50);
    });
  }, [step]);

  /* ── Summary rows ── */
  const summaryRows = [
    ['State',    formData.State],
    ['District', formData.District],
    ['Market',   formData.Market],
    ['Variety',  formData.Variety],
    ['Grade',    formData.Grade],
    ['Date',     formData.Arrival_Date],
  ];

  /* ── Progress ── */
  const progPct = Math.max(Math.round(((step - 1) / 3) * 100), 5);

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <div className="pp-page">
      <NavScrollExample />

      {/* Inserted the Floating Leaves Background here */}
      <FloatingLeaves />

      <div className="pp-content">

        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-hero-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M6 4h12M6 9h12M6 9a4 4 0 004 4h0a4 4 0 000 8H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 17l4-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="pp-hero-title">Onion Price Forecasting</h1>
          <p className="pp-hero-sub">AI-powered market rate predictions for smarter selling</p>
        </div>

        <div className="pp-wizard">

          {/* Live badge */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="pp-live-badge">
              <span className="pp-live-dot" />
              🧅 Commodity: Onion — Live Forecast
            </span>
          </div>

          {/* Steps */}
          <div className="pp-steps">
            {STEPS.map((s, i) => {
              const num = i + 1;
              const cls = `pp-step-item${step > num ? ' done' : step === num ? ' active' : ''}`;
              return (
                <div key={num} className={cls}>
                  <div className="pp-step-dot">{step > num ? '✓' : s.emoji}</div>
                  <span className="pp-step-label">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="pp-prog-wrap">
            <div className="pp-prog-bg">
              <div className="pp-prog-fill" style={{ width: progPct + '%' }} />
            </div>
            <div className="pp-prog-text">
              {step <= 3 ? `Step ${step} of 3` : 'Complete'}
            </div>
          </div>

          {/* Card */}
          <div className="pp-card">

            {/* ── STEP 1: Location ── */}
            {step === 1 && (
              <div className="pp-panel" key={`s1-${animKey}`}>
                <div className="pp-sec-head">
                  <span className="pp-sec-icon">📍</span>
                  Market Location
                </div>

                <div className="pp-grid-2" style={{ marginBottom: '1rem' }}>
                  {/* State */}
                  <div className="pp-field">
                    <label className="pp-label">State <span className="pp-req">*</span></label>
                    <div className="pp-inp-wrap">
                      <input type="text" placeholder="e.g. Maharashtra" value={formData.State} onChange={e => handleChange('State', e.target.value)} autoComplete="off" />
                      <span className={`pp-valid-check${formData.State.trim() ? ' show' : ''}`}>✓</span>
                    </div>
                  </div>

                  {/* District */}
                  <div className="pp-field">
                    <label className="pp-label">District <span className="pp-req">*</span></label>
                    <div className="pp-inp-wrap">
                      <input type="text" placeholder="e.g. Nashik" value={formData.District} onChange={e => handleChange('District', e.target.value)} autoComplete="off" />
                      <span className={`pp-valid-check${formData.District.trim() ? ' show' : ''}`}>✓</span>
                    </div>
                  </div>
                </div>

                {/* Market */}
                <div className="pp-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="pp-label">Market Name <span className="pp-req">*</span></label>
                  <div className="pp-inp-wrap">
                    <input type="text" placeholder="e.g. Lasalgaon" value={formData.Market} onChange={e => handleChange('Market', e.target.value)} autoComplete="off" />
                    <span className={`pp-valid-check${formData.Market.trim() ? ' show' : ''}`}>✓</span>
                  </div>
                </div>

                <div className="pp-nav-row">
                  <div style={{ position: 'relative', flex: 2 }}>
                    {step1Valid && <div className="pp-pulse-ring" />}
                    <button type="button" className="pp-btn-next" style={{ width: '100%' }} disabled={!step1Valid} onClick={() => goTo(2)}>
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Crop Details ── */}
            {step === 2 && (
              <div className="pp-panel" key={`s2-${animKey}`}>
                <div className="pp-sec-head">
                  <span className="pp-sec-icon">🌾</span>
                  Crop Details
                </div>

                {/* Variety quick-select */}
                <div className="pp-field" style={{ marginBottom: '1.25rem' }}>
                  <label className="pp-label">Variety <span className="pp-req">*</span></label>
                  <div className="pp-select-grid">
                    {[
                      { val: 'Other',    emoji: '🧅' },
                      { val: 'Red',      emoji: '🔴' },
                      { val: 'White',    emoji: '⚪' },
                    ].map(v => (
                      <button
                        key={v.val}
                        type="button"
                        className={`pp-select-btn${formData.Variety === v.val ? ' sel' : ''}`}
                        onClick={() => handleChange('Variety', v.val)}
                      >
                        <span className="pp-sb-emoji">{v.emoji}</span>
                        {v.val}
                      </button>
                    ))}
                  </div>
                  {/* fallback text input */}
                  <div className="pp-inp-wrap" style={{ marginTop: '8px' }}>
                    <input
                      type="text" placeholder="Or type custom variety..."
                      value={formData.Variety}
                      onChange={e => handleChange('Variety', e.target.value)}
                    />
                    <span className={`pp-valid-check${formData.Variety.trim() ? ' show' : ''}`}>✓</span>
                  </div>
                </div>

                <hr className="pp-divider" />

                {/* Grade quick-select */}
                <div className="pp-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="pp-label">Grade <span className="pp-req">*</span></label>
                  <div className="pp-select-grid">
                    {[
                      { val: 'FAQ',    emoji: '⭐' },
                      { val: 'Medium', emoji: '🟡' },
                      { val: 'Large',  emoji: '🔵' },
                    ].map(g => (
                      <button
                        key={g.val}
                        type="button"
                        className={`pp-select-btn${formData.Grade === g.val ? ' sel' : ''}`}
                        onClick={() => handleChange('Grade', g.val)}
                      >
                        <span className="pp-sb-emoji">{g.emoji}</span>
                        {g.val}
                      </button>
                    ))}
                  </div>
                  <div className="pp-inp-wrap" style={{ marginTop: '8px' }}>
                    <input
                      type="text" placeholder="Or type custom grade..."
                      value={formData.Grade}
                      onChange={e => handleChange('Grade', e.target.value)}
                    />
                    <span className={`pp-valid-check${formData.Grade.trim() ? ' show' : ''}`}>✓</span>
                  </div>
                </div>

                <div className="pp-nav-row">
                  <button type="button" className="pp-btn-back" onClick={() => goTo(1)}>← Back</button>
                  <button type="button" className="pp-btn-next" disabled={!step2Valid} onClick={() => goTo(3)}>Next →</button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Date ── */}
            {step === 3 && (
              <div className="pp-panel" key={`s3-${animKey}`}>
                <div className="pp-sec-head">
                  <span className="pp-sec-icon">📅</span>
                  Arrival Date
                </div>

                <div className="pp-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="pp-label">Date of Arrival <span className="pp-req">*</span></label>
                  <div className="pp-inp-wrap">
                    <input
                      type="date"
                      value={formData.Arrival_Date}
                      onChange={e => handleChange('Arrival_Date', e.target.value)}
                    />
                    <span className={`pp-valid-check${formData.Arrival_Date ? ' show' : ''}`}>✓</span>
                  </div>
                </div>

                <div className="pp-nav-row">
                  <button type="button" className="pp-btn-back" onClick={() => goTo(2)}>← Back</button>
                  <div style={{ position: 'relative', flex: 2 }}>
                    {step3Valid && <div className="pp-pulse-ring" />}
                    <button
                      type="button" className="pp-btn-next" style={{ width: '100%' }}
                      disabled={!step3Valid} onClick={handleSubmit}
                    >
                      📊 Predict Price
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Result ── */}
            {step === 4 && (
              <div className="pp-panel" key={`s4-${animKey}`} ref={resultRef}>

                {/* Loading */}
                {loading && (
                  <div className="pp-loading-wrap">
                    <div className="pp-loading-text">Fetching market rates...</div>
                    <div className="pp-dots">
                      <div className="pp-dot" /><div className="pp-dot" /><div className="pp-dot" />
                    </div>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <>
                    <div className="pp-error">⚠️ {error}</div>
                    <button type="button" className="pp-btn-back" style={{ marginTop: '1rem', width: '100%' }} onClick={() => goTo(3)}>
                      ← Go back &amp; retry
                    </button>
                  </>
                )}

                {/* Success */}
                {!loading && prediction && !error && (
                  <>
                    {/* Input summary */}
                    <div className="pp-summary">
                      <div className="pp-summary-title">Your inputs</div>
                      <div className="pp-summary-grid">
                        {summaryRows.map(([k, v]) => (
                          <div className="pp-sum-row" key={k}>
                            <span className="pp-sum-key">{k}</span>
                            <span className="pp-sum-val">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result */}
                    <div className="pp-result-wrap">
                      <div className="pp-res-banner">
                        📈 Predicted Market Rates — per Quintal
                      </div>
                      <div className="pp-price-grid">
                        {/* Min */}
                        <div className="pp-price-col">
                          <div className="pp-price-label">Min Price</div>
                          <div className="pp-price-val side">₹{displayMin.toLocaleString()}</div>
                          <div className="pp-price-unit">per quintal</div>
                        </div>

                        <div className="pp-price-divider-v" />

                        {/* Modal — highlighted */}
                        <div className="pp-price-col">
                          <div className="pp-modal-glow">
                            <div className="pp-price-label modal">Modal Price</div>
                            <div className="pp-price-val modal">₹{displayModal.toLocaleString()}</div>
                            <div className="pp-price-unit">best estimate</div>
                          </div>
                        </div>

                        <div className="pp-price-divider-v" />

                        {/* Max */}
                        <div className="pp-price-col">
                          <div className="pp-price-label">Max Price</div>
                          <div className="pp-price-val side">₹{displayMax.toLocaleString()}</div>
                          <div className="pp-price-unit">per quintal</div>
                        </div>
                      </div>
                      <div className="pp-tip">
                        💡 Sell closer to the modal price for the best market returns
                      </div>
                    </div>

                    <button type="button" className="pp-reset-btn" onClick={handleReset}>
                      🔄 New Prediction
                    </button>
                  </>
                )}

              </div>
            )}

          </div>{/* /card */}
        </div>{/* /wizard */}
      </div>{/* /content */}

      <Footer />
    </div>
  );
};

export default PricePredictor;