import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavScrollExample from '../navbar';
import Footer from '../common/footer';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .hp-root {
    font-family: 'Nunito', sans-serif;
    overflow-x: hidden;
    background: #f8fdf9;
  }

  /* ══ Scroll reveal utility ══ */
  .reveal {
    opacity: 0; transform: translateY(36px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.34,1.2,.64,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left  { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.34,1.2,.64,1); }
  .reveal-right { opacity: 0; transform: translateX(40px);  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.34,1.2,.64,1); }
  .reveal-left.visible, .reveal-right.visible { opacity: 1; transform: translateX(0); }
  .reveal-scale { opacity: 0; transform: scale(0.88); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.56,.64,1); }
  .reveal-scale.visible { opacity: 1; transform: scale(1); }

  /* ══ Hero Carousel ══ */
  .hp-carousel { position: relative; }
  .hp-carousel .carousel-item img {
    height: 88vh; min-height: 500px;
    object-fit: cover; object-position: center;
    filter: brightness(0.58);
  }
  .hp-carousel .carousel-caption {
    bottom: 50%; transform: translateY(50%);
    text-align: left; max-width: 640px; left: 6%; right: auto;
  }
  .hp-carousel .carousel-caption h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    font-weight: 800; color: #fff; margin-bottom: 14px;
    text-shadow: 0 2px 16px rgba(0,0,0,0.4);
    line-height: 1.2;
  }
  .hp-carousel .carousel-caption p {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    font-weight: 600; color: rgba(255,255,255,0.88);
    margin-bottom: 24px; line-height: 1.65;
  }
  .hp-carousel-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(82,183,136,0.28); border: 1.5px solid rgba(82,183,136,0.55);
    border-radius: 20px; padding: 5px 14px;
    font-size: 0.78rem; font-weight: 800; color: #b7e4c7;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 14px; backdrop-filter: blur(6px);
  }
  .hp-carousel-dot { width: 7px; height: 7px; border-radius: 50%; background: #52b788; animation: hpPulse 1.8s ease infinite; }
  .hp-hero-cta {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    color: #fff; font-family: 'Nunito', sans-serif; font-weight: 800;
    font-size: 0.95rem; padding: 12px 26px; border-radius: 14px;
    border: none; text-decoration: none;
    box-shadow: 0 4px 20px rgba(58,125,68,0.4);
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
    margin-right: 12px;
  }
  .hp-hero-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(58,125,68,0.5); color: #fff; }
  .hp-hero-cta-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.5);
    color: #fff; font-family: 'Nunito', sans-serif; font-weight: 800;
    font-size: 0.95rem; padding: 10px 24px; border-radius: 14px;
    text-decoration: none; backdrop-filter: blur(6px);
    transition: all 0.2s;
  }
  .hp-hero-cta-outline:hover { background: rgba(255,255,255,0.2); color: #fff; transform: translateY(-2px); }

  /* Scroll hint arrow */
  .hp-scroll-hint {
    position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    z-index: 10; animation: hpBob 2s ease-in-out infinite;
  }
  .hp-scroll-hint span { font-size: 0.7rem; color: rgba(255,255,255,0.55); font-weight: 700; letter-spacing: 0.06em; }
  .hp-scroll-arrow { width: 22px; height: 22px; border-right: 2.5px solid rgba(255,255,255,0.5); border-bottom: 2.5px solid rgba(255,255,255,0.5); transform: rotate(45deg); margin-top: -8px; }

  /* ══ Stats strip ══ */
  .hp-stats {
    background: linear-gradient(135deg, #1b4332, #2d6a4f);
    padding: 0;
  }
  .hp-stats-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  @media(max-width: 768px) { .hp-stats-inner { grid-template-columns: repeat(2, 1fr); } }
  .hp-stat-item {
    padding: 2rem 1.5rem;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,0.08);
    transition: background 0.2s;
  }
  .hp-stat-item:last-child { border-right: none; }
  .hp-stat-item:hover { background: rgba(255,255,255,0.05); }
  .hp-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem; font-weight: 800; color: #95d5b2;
    line-height: 1; margin-bottom: 5px;
  }
  .hp-stat-label { font-size: 0.82rem; font-weight: 700; color: rgba(255,255,255,0.65); }

  /* ══ Section base ══ */
  .hp-section { padding: 5rem 0; }
  .hp-section-alt { background: #fff; }

  .hp-section-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: #e8f5e2; border: 1.5px solid #b7e4c7;
    border-radius: 20px; padding: 5px 14px;
    font-size: 0.75rem; font-weight: 800;
    color: #1b4332; letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .hp-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 800; color: #1b2e22; line-height: 1.2; margin-bottom: 14px;
  }
  .hp-section-sub {
    font-size: 1rem; color: #52796f; font-weight: 600; max-width: 560px; line-height: 1.7;
  }

  /* ══ Feature cards ══ */
  .hp-feat-card {
    border-radius: 20px; padding: 2rem 1.5rem;
    background: #fff; height: 100%;
    border: 1px solid #e8f0eb;
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease, border-color 0.3s;
    cursor: default; position: relative; overflow: hidden;
  }
  .hp-feat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--card-color, linear-gradient(90deg, #3a7d44, #52b788));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s ease;
  }
  .hp-feat-card:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); border-color: transparent; }
  .hp-feat-card:hover::before { transform: scaleX(1); }

  .hp-feat-icon {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; margin-bottom: 16px;
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  .hp-feat-card:hover .hp-feat-icon { transform: scale(1.15) rotate(-5deg); }

  .hp-feat-title { font-size: 1.05rem; font-weight: 800; color: #1b2e22; margin-bottom: 8px; }
  .hp-feat-desc  { font-size: 0.87rem; color: #52796f; font-weight: 600; line-height: 1.65; margin-bottom: 14px; }
  .hp-feat-badge {
    display: inline-flex; font-size: 0.73rem; font-weight: 800;
    padding: 3px 10px; border-radius: 8px; letter-spacing: 0.03em;
  }

  .hp-feat-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.83rem; font-weight: 800; text-decoration: none;
    color: #3a7d44; margin-top: 12px;
    transition: gap 0.2s;
  }
  .hp-feat-link:hover { gap: 9px; color: #1b4332; }

  /* ══ How it works ══ */
  .hp-step {
    display: flex; gap: 20px; align-items: flex-start;
    padding: 1.5rem; border-radius: 18px;
    background: #f8fdf9; border: 1px solid #e2f0e6;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s;
  }
  .hp-step:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(58,125,68,0.1); }
  .hp-step-num {
    width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 900; color: #fff;
    box-shadow: 0 4px 14px rgba(58,125,68,0.3);
  }
  .hp-step-title { font-size: 1rem; font-weight: 800; color: #1b2e22; margin-bottom: 5px; }
  .hp-step-desc  { font-size: 0.85rem; color: #52796f; font-weight: 600; line-height: 1.6; margin: 0; }

  /* connector line */
  .hp-step-connector {
    width: 2px; height: 28px; background: linear-gradient(#d8f3dc, transparent);
    margin: 4px 0 4px 21px;
  }

  /* ══ Farming facts strip ══ */
  .hp-facts-section {
    background: linear-gradient(135deg, #1b4332, #0d2b1a);
    padding: 3.5rem 0;
    overflow: hidden;
  }
  .hp-facts-scroll-wrap { overflow: hidden; }
  .hp-facts-scroll {
    display: flex; gap: 14px;
    animation: hpScroll 32s linear infinite;
    width: max-content;
  }
  .hp-facts-scroll:hover { animation-play-state: paused; }
  @keyframes hpScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .hp-facts-chip {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(82,183,136,0.1); border: 1px solid rgba(82,183,136,0.2);
    border-radius: 12px; padding: 8px 16px; white-space: nowrap;
    font-size: 0.85rem; font-weight: 700; color: #95d5b2;
    transition: all 0.2s; cursor: default;
  }
  .hp-facts-chip:hover {
    background: rgba(82,183,136,0.22);
    border-color: rgba(82,183,136,0.4);
    transform: translateY(-3px);
  }

  /* ══ Problem-Solution section ══ */
  .hp-problem-card {
    border-radius: 18px; padding: 1.4rem;
    background: #fff5f5; border: 1px solid #fecaca;
    transition: transform 0.25s;
  }
  .hp-problem-card:hover { transform: translateY(-4px); }
  .hp-solution-card {
    border-radius: 18px; padding: 1.4rem;
    background: #f0faf4; border: 1px solid #b7e4c7;
    transition: transform 0.25s;
  }
  .hp-solution-card:hover { transform: translateY(-4px); }
  .hp-ps-icon { font-size: 1.4rem; margin-bottom: 8px; }
  .hp-ps-title { font-size: 0.88rem; font-weight: 800; margin-bottom: 4px; }
  .hp-ps-desc  { font-size: 0.82rem; font-weight: 600; line-height: 1.55; margin: 0; }
  .hp-problem-card .hp-ps-title { color: #7f1d1d; }
  .hp-problem-card .hp-ps-desc  { color: #b91c1c; }
  .hp-solution-card .hp-ps-title { color: #14532d; }
  .hp-solution-card .hp-ps-desc  { color: #166534; }

  /* ══ Impact section ══ */
  .hp-impact-card {
    border-radius: 20px; padding: 2rem 1.5rem; text-align: center;
    background: #fff; border: 1px solid #e8f0eb; height: 100%;
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
  }
  .hp-impact-card:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(0,0,0,0.09); }
  .hp-impact-icon { font-size: 2.4rem; margin-bottom: 12px; }
  .hp-impact-num {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 800; color: #2d6a4f; margin-bottom: 4px;
  }
  .hp-impact-label { font-size: 0.85rem; font-weight: 800; color: #1b2e22; margin-bottom: 8px; }
  .hp-impact-desc  { font-size: 0.8rem; color: #52796f; font-weight: 600; line-height: 1.6; margin: 0; }

  /* ══ Quote / vision band ══ */
  .hp-vision {
    background: linear-gradient(135deg, #d8f3dc, #b7e4c7);
    padding: 4rem 0; text-align: center;
  }
  .hp-vision-quote {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
    font-weight: 800; color: #1b4332; line-height: 1.5;
    max-width: 760px; margin: 0 auto 14px;
  }
  .hp-vision-sub { font-size: 0.9rem; color: #2d6a4f; font-weight: 700; }

  /* ══ CTA banner ══ */
  .hp-cta {
    background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 40%, #3a7d44 100%);
    padding: 5rem 0; text-align: center; position: relative; overflow: hidden;
  }
  .hp-cta::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(82,183,136,0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(82,183,136,0.15) 0%, transparent 50%);
    pointer-events: none;
  }
  .hp-cta-inner { position: relative; z-index: 1; }
  .hp-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 800;
    color: #fff; margin-bottom: 14px; line-height: 1.2;
  }
  .hp-cta-sub { font-size: 1rem; color: rgba(255,255,255,0.75); font-weight: 600; margin-bottom: 2rem; }
  .hp-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #fff; color: #1b4332; font-family: 'Nunito', sans-serif;
    font-weight: 900; font-size: 1rem; padding: 13px 30px; border-radius: 14px;
    text-decoration: none; border: none;
    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;
    margin: 6px;
  }
  .hp-cta-btn:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(0,0,0,0.25); color: #1b4332; }

  /* ══ Shared keyframes ══ */
  @keyframes hpPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.65); }
  }
  @keyframes hpBob {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50%      { transform: translateX(-50%) translateY(-8px); }
  }

  /* ══ Responsive ══ */
  @media(max-width: 768px) {
    .hp-carousel .carousel-caption { left: 5%; right: 5%; text-align: center; }
    .hp-hero-cta, .hp-hero-cta-outline { display: block; margin: 6px 0; text-align: center; }
  }
`;

/* ── Scroll reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Counter animation ── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ── Data ── */
const FEATURES = [
  {
    icon: '🌾', title: 'Crop Yield Predictor',
    desc: 'Before harvest, farmers often have no way to estimate how much their field will produce. Our yield predictor analyzes your soil health, local weather patterns, and crop variety to give you an accurate estimate — so you can plan storage, transport, and sale in advance.',
    badge: 'Onion & Cotton Crops', badgeBg: '#d8f3dc', badgeColor: '#1b4332',
    to: '/yield-prediction', cardColor: 'linear-gradient(90deg, #3a7d44, #52b788)',
    iconBg: '#e8f5e2',
  },
  {
    icon: '💰', title: 'Market Price Forecast',
    desc: 'Farmers lose lakhs every year by selling at the wrong time. Our price forecasting module studies 14+ years of government market data to predict upcoming onion price trends — helping you decide the best time and market to sell.',
    badge: 'Trained on 14+ Years Data', badgeBg: '#e0f2fe', badgeColor: '#0c4a6e',
    to: '/rate-predictor', cardColor: 'linear-gradient(90deg, #0284c7, #38bdf8)',
    iconBg: '#e0f2fe',
  },
  {
    icon: '📈', title: 'Live Market Rates',
    desc: 'Every day, market prices change across mandis in India. Our live rate page fetches real-time commodity prices from the Government of India database, so you always know what your crop is worth at any district market — before you load your truck.',
    badge: 'Updated Daily from Govt. Data', badgeBg: '#fef9c3', badgeColor: '#713f12',
    to: '/market-rate', cardColor: 'linear-gradient(90deg, #d97706, #fbbf24)',
    iconBg: '#fef9c3',
  },
  {
    icon: '🤖', title: 'AI Farming Assistant',
    desc: 'A farmer field doesnt follow a 9-to-5 schedule. Our AI chatbot is available 24/7 to answer questions about crop diseases, fertilizer dosage, pest control, irrigation timing, and government schemes — all in simple, easy-to-understand language.',
    badge: 'Available 24/7', badgeBg: '#f5d0fe', badgeColor: '#581c87',
    to: '/chatbot', cardColor: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
    iconBg: '#f5d0fe',
  },
  {
    icon: '🏪', title: 'Farmer Marketplace',
    desc: 'Today, most farmers are forced to sell through middlemen who take a large cut of the profit. Our marketplace creates a direct channel between farmers and merchants — you list your produce, buyers make offers, and you choose the best deal without any agent in between.',
    badge: 'No Middlemen', badgeBg: '#fee2e2', badgeColor: '#7f1d1d',
    to: '/market', cardColor: 'linear-gradient(90deg, #dc2626, #f87171)',
    iconBg: '#fee2e2',
  },
  {
    icon: '🌿', title: 'Crop Disease Detection',
    desc: 'A single undetected disease can wipe out an entire field. Our disease detection module lets farmers click a photo of an infected leaf, and the AI model identifies the disease and recommends treatment — potentially saving the entire crop. (Coming Soon)',
    badge: 'Photo-Based Detection', badgeBg: '#d8f3dc', badgeColor: '#1b4332',
    to: '/', cardColor: 'linear-gradient(90deg, #059669, #34d399)',
    iconBg: '#e8f5e2',
  },
];

const HOW_IT_WORKS = [
  {
    num: '1', icon: '📋', title: 'Share Your Farm Details',
    desc: 'Tell us about your field — your district, soil type, crop variety, nitrogen-phosphorus-potassium levels, and the date you sowed. The more details you share, the more accurate your results will be.',
  },
  {
    num: '2', icon: '🧠', title: 'AI Studies Your Data',
    desc: 'Our prediction models compare your farm inputs against historical data from thousands of fields across India — covering 14+ years of yield records, weather patterns, and market prices — to find the most accurate match.',
  },
  {
    num: '3', icon: '📊', title: 'Receive Smart Predictions',
    desc: 'You get a clear yield estimate (how many quintals your field will likely produce) and a price forecast (what your crop may sell for in the coming weeks) — so you can plan your entire post-harvest strategy in advance.',
  },
  {
    num: '4', icon: '🤝', title: 'Sell Directly, Earn More',
    desc: 'Once your harvest is ready, list your produce on our marketplace. Verified merchants browse listings and contact you directly. No commission, no middleman — just a fair price for your hard work.',
  },
];

const PROBLEMS = [
  {
    icon: '🌧️', title: 'Unpredictable Crop Yields',
    desc: 'Erratic rainfall, unexpected temperature drops, soil degradation, and pest attacks cause wide variation in yield. Without any forecasting tool, farmers often under-prepare for bad seasons or over-invest in good ones.',
  },
  {
    icon: '📉', title: 'Selling at the Wrong Time',
    desc: 'Onion prices in India can swing from ₹2/kg to ₹80/kg in the same year. Most farmers have no access to price trend data and end up selling at harvest time — which is often the lowest point of the price cycle.',
  },
  {
    icon: '🔗', title: 'Forced Middleman Dependency',
    desc: 'In most Indian villages, farmers have no direct contact with city buyers or exporters. They are forced to sell through commission agents (arhatias) who deduct 8–10% from every sale, significantly reducing farmer income.',
  },
  {
    icon: '📚', title: 'No Expert Guidance on Demand',
    desc: 'Agricultural extension officers cover hundreds of villages each, making it impossible for every farmer to get timely advice on disease outbreaks, fertilizer schedules, or weather-based sowing decisions.',
  },
];

const SOLUTIONS = [
  {
    icon: '🌾', title: 'Accurate Pre-Harvest Yield Estimate',
    desc: 'By analyzing soil NPK levels, weather data, and regional crop history, FarmEra tells you expected yield weeks before harvest — giving you time to arrange storage, negotiate contracts, and plan transport.',
  },
  {
    icon: '💰', title: 'Price Intelligence Before You Sell',
    desc: 'Our model forecasts onion market prices by studying 14+ years of price movement data from government mandis. You see predicted price trends for the next weeks, so you can hold or sell at the right moment.',
  },
  {
    icon: '🏪', title: 'Direct Buyer-Farmer Connection',
    desc: 'Our marketplace removes the agent entirely. You post your crop details, quantity, and expected price. Merchants from across the region can view and contact you directly — giving you full negotiating power.',
  },
  {
    icon: '🤖', title: '24/7 AI Farming Guidance',
    desc: 'Our AI assistant answers farming questions anytime — in plain language. Whether you need advice on a yellowing crop, irrigation schedule, or government scheme eligibility, help is just one message away.',
  },
];

const FARMING_FACTS = [
  '🌱 58% of India\'s population depends on agriculture',
  '🌧️ 60% of Indian farmland is rain-fed with no irrigation',
  '📉 Farmers earn only 25–30% of the final consumer price',
  '🧅 India is the world\'s 2nd largest onion producer',
  '🌿 Cotton is grown across 120 lakh hectares in India',
  '💸 Post-harvest losses cost India ₹92,000 crore per year',
  '📱 Only 23% of farmers use any digital tool for farming decisions',
  '🤝 80% of farmers sell through commission agents (arhatias)',
  '🌡️ Climate change has increased crop failure risk by 35% since 2000',
  '🧑‍🌾 Average Indian farmer earns less than ₹10,000 per month',
  '🗺️ Maharashtra produces 35% of India\'s total onion output',
  '📊 Price prediction can increase farmer income by 20–40%',
];

const IMPACT_DATA = [
  {
    icon: '💰', num: '₹20,000+', label: 'Extra Income per Season',
    desc: 'Farmers who sell at the right time using price intelligence earn significantly more than those who sell at harvest.',
  },
  {
    icon: '🌾', num: '40%', label: 'Reduction in Crop Waste',
    desc: 'Pre-harvest yield estimates help farmers arrange proper storage and transportation before the crop is ready.',
  },
  {
    icon: '🤝', num: '8–10%', label: 'Commission Saved per Sale',
    desc: 'Direct marketplace connections mean farmers keep the commission that previously went to middlemen.',
  },
  {
    icon: '⏱️', num: '24/7', label: 'Expert Advice Availability',
    desc: 'AI-powered guidance means farmers don\'t have to wait for an agricultural officer for basic crop health questions.',
  },
];

const CAROUSEL_SLIDES = [
  {
    img: 'https://wallpapers.com/images/hd/organic-farming-1162-x-700-wallpaper-snmzav3nv42lgclu.jpg',
    alt: 'Organic farming fields',
    title: 'From Sowing to Selling — Powered by AI',
    desc: 'FarmEra is an intelligent farming platform that helps Indian farmers predict yields, forecast prices, and connect with buyers — all in one place.',
    cta: 'Start Predicting', ctaTo: '/yield-prediction',
  },
  {
    img: 'https://images.pexels.com/photos/221016/pexels-photo-221016.jpeg?cs=srgb&dl=pexels-blooddrainer-221016.jpg&fm=jpg',
    alt: 'Onion field',
    title: 'Know Your Yield Before You Harvest',
    desc: 'Stop guessing. Our prediction model trained on real government agricultural data helps you estimate your onion and cotton crop yield weeks before harvest — so you can plan every step that follows.',
    cta: 'Try Yield Predictor', ctaTo: '/yield-prediction',
  },
  {
    img: 'https://ajaybiotech.com/images/banner-blog-agriculture-mobile.jpg',
    alt: 'Smart farming',
    title: 'Sell Smarter. Earn More.',
    desc: 'Onion prices can change by 10x in a single year. AI-powered price forecasting and live market rates help you pick the right market and the right moment to sell — and keep more of what you earn.',
    cta: 'View Live Rates', ctaTo: '/market-rate',
  },
];

/* ══════════════════════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════════════════════ */
export default function HomePage() {
  useReveal();

  useEffect(() => {
    if (!document.getElementById('hp-styles')) {
      const tag = document.createElement('style');
      tag.id = 'hp-styles';
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => { const t = document.getElementById('hp-styles'); if (t) t.remove(); };
  }, []);

  const [c1, r1] = useCounter(58,  1600);
  const [c2, r2] = useCounter(14,  1800);
  const [c3, r3] = useCounter(120, 1400);
  const [c4, r4] = useCounter(6,   1200);

  return (
    <div className="hp-root">
      <NavScrollExample />

      {/* ══ HERO CAROUSEL ══ */}
      <section className="hp-carousel">
        <Carousel data-bs-theme="dark" interval={5000} pause="hover">
          {CAROUSEL_SLIDES.map((slide, i) => (
            <Carousel.Item key={i}>
              <img className="d-block w-100" src={slide.img} alt={slide.alt} />
              <Carousel.Caption>
                <div className="hp-carousel-badge">
                  <span className="hp-carousel-dot" />
                  FarmEra · AI for Every Farmer
                </div>
                <h1>{slide.title}</h1>
                <p>{slide.desc}</p>
                <div>
                  <Link to={slide.ctaTo} className="hp-hero-cta">{slide.cta} →</Link>
                  <Link to="/chatbot" className="hp-hero-cta-outline">🤖 Ask AI Expert</Link>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="hp-scroll-hint">
          <span>SCROLL</span>
          <div className="hp-scroll-arrow" />
        </div>
      </section>

      {/* ══ STATS STRIP ══ */}
      <section className="hp-stats">
        <Container fluid className="p-0">
          <div className="hp-stats-inner">
            <div className="hp-stat-item reveal-scale" ref={r1}>
              <div className="hp-stat-num">{c1}%</div>
              <div className="hp-stat-label">👨‍🌾 Indians Depend on Farming</div>
            </div>
            <div className="hp-stat-item reveal-scale" ref={r2} style={{ transitionDelay: '0.1s' }}>
              <div className="hp-stat-num">{c2}+ Yrs</div>
              <div className="hp-stat-label">📅 Market Data Analyzed</div>
            </div>
            <div className="hp-stat-item reveal-scale" ref={r3} style={{ transitionDelay: '0.2s' }}>
              <div className="hp-stat-num">{c3}L Ha</div>
              <div className="hp-stat-label">🌿 Cotton Area Covered in India</div>
            </div>
            <div className="hp-stat-item reveal-scale" ref={r4} style={{ transitionDelay: '0.3s' }}>
              <div className="hp-stat-num">{c4}</div>
              <div className="hp-stat-label">🚀 Farmer Support Modules</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ VISION QUOTE ══ */}
      <section className="hp-vision reveal">
        <Container>
          <p className="hp-vision-quote">
            "The farmer who plants a seed today shouldn't have to guess what it will be worth at harvest. FarmEra gives every farmer the knowledge to plan, predict, and prosper."
          </p>
          <p className="hp-vision-sub">— FarmEra Mission Statement</p>
        </Container>
      </section>

      {/* ══ PROBLEM → SOLUTION ══ */}
      <section className="hp-section hp-section-alt">
        <Container>
          <div className="text-center mb-5 reveal">
            <span className="hp-section-eyebrow">⚡ Why FarmEra Exists</span>
            <h2 className="hp-section-title">The Real Challenges Indian Farmers Face</h2>
            <p className="hp-section-sub mx-auto">
              Indian agriculture feeds over a billion people, yet the people who grow the food often struggle the most. These are the core problems FarmEra was built to solve.
            </p>
          </div>
          <Row className="g-4">
            <Col lg={6}>
              <h5 className="fw-800 mb-3 reveal-left" style={{ fontFamily: 'Nunito', color: '#7f1d1d', fontWeight: 800 }}>
                ❌ Challenges Farmers Face Daily
              </h5>
              <div className="d-flex flex-column gap-3">
                {PROBLEMS.map((p, i) => (
                  <div key={i} className="hp-problem-card reveal-left" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className="hp-ps-icon">{p.icon}</div>
                    <div className="hp-ps-title">{p.title}</div>
                    <p className="hp-ps-desc">{p.desc}</p>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <h5 className="fw-800 mb-3 reveal-right" style={{ fontFamily: 'Nunito', color: '#14532d', fontWeight: 800 }}>
                ✅ How FarmEra Solves Them
              </h5>
              <div className="d-flex flex-column gap-3">
                {SOLUTIONS.map((s, i) => (
                  <div key={i} className="hp-solution-card reveal-right" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className="hp-ps-icon">{s.icon}</div>
                    <div className="hp-ps-title">{s.title}</div>
                    <p className="hp-ps-desc">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="hp-section">
        <Container>
          <div className="text-center mb-5 reveal">
            <span className="hp-section-eyebrow">🌱 Platform Modules</span>
            <h2 className="hp-section-title">Six Tools Built Around the Farmer's Journey</h2>
            <p className="hp-section-sub mx-auto">
              From the moment a seed goes in the ground to the moment the crop changes hands — FarmEra supports every decision a farmer makes along the way.
            </p>
          </div>

          <Row className="g-4">
            {FEATURES.map((f, i) => (
              <Col md={6} lg={4} key={i}>
                <div className="hp-feat-card reveal" style={{ transitionDelay: `${i * 0.08}s`, '--card-color': f.cardColor }}>
                  <div className="hp-feat-icon" style={{ background: f.iconBg }}>{f.icon}</div>
                  <div className="hp-feat-title">{f.title}</div>
                  <div className="hp-feat-desc">{f.desc}</div>
                  <span className="hp-feat-badge" style={{ background: f.badgeBg, color: f.badgeColor }}>
                    {f.badge}
                  </span>
                  <br />
                  <Link to={f.to} className="hp-feat-link">
                    Explore feature <span>→</span>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="hp-section hp-section-alt">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <div className="reveal-left">
                <span className="hp-section-eyebrow">🔄 Your Journey</span>
                <h2 className="hp-section-title">How FarmEra Works for You</h2>
                <p className="hp-section-sub">
                  FarmEra is designed for simplicity. You don't need any technical knowledge — just share basic details about your farm and crop, and let the platform guide you through every step from prediction to sale.
                </p>
              </div>
            </Col>
            <Col lg={7}>
              <div className="d-flex flex-column">
                {HOW_IT_WORKS.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="hp-step reveal-right" style={{ transitionDelay: `${i * 0.12}s` }}>
                      <div className="hp-step-num">{step.icon}</div>
                      <div>
                        <div className="hp-step-title">Step {step.num}: {step.title}</div>
                        <p className="hp-step-desc">{step.desc}</p>
                      </div>
                    </div>
                    {i < HOW_IT_WORKS.length - 1 && <div className="hp-step-connector" />}
                  </React.Fragment>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ══ IMPACT ══ */}
      <section className="hp-section">
        <Container>
          <div className="text-center mb-5 reveal">
            <span className="hp-section-eyebrow">📊 Real Impact</span>
            <h2 className="hp-section-title">What FarmEra Means for a Farmer's Life</h2>
            <p className="hp-section-sub mx-auto">
              Better decisions at every stage of farming don't just improve profits — they reduce stress, reduce waste, and give farmers more control over their own livelihoods.
            </p>
          </div>
          <Row className="g-4">
            {IMPACT_DATA.map((item, i) => (
              <Col md={6} lg={3} key={i}>
                <div className="hp-impact-card reveal-scale" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="hp-impact-icon">{item.icon}</div>
                  <div className="hp-impact-num">{item.num}</div>
                  <div className="hp-impact-label">{item.label}</div>
                  <p className="hp-impact-desc">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══ FARMING FACTS SCROLL STRIP ══ */}
      <section className="hp-facts-section">
        <Container className="mb-4 reveal">
          <div className="text-center">
            <span className="hp-section-eyebrow" style={{ background: 'rgba(82,183,136,0.12)', borderColor: 'rgba(82,183,136,0.25)', color: '#95d5b2' }}>
              📰 Did You Know?
            </span>
            <h2 className="hp-section-title" style={{ color: '#fff' }}>Facts About Indian Agriculture</h2>
          </div>
        </Container>
        <div className="hp-facts-scroll-wrap px-3">
          <div className="hp-facts-scroll">
            {[...FARMING_FACTS, ...FARMING_FACTS].map((fact, i) => (
              <span key={i} className="hp-facts-chip">{fact}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <Container>
            <div className="reveal">
              <p className="hp-section-eyebrow mx-auto d-inline-flex" style={{ background: 'rgba(82,183,136,0.15)', borderColor: 'rgba(82,183,136,0.3)', color: '#95d5b2' }}>
                🚀 Get Started Today
              </p>
              <h2 className="hp-cta-title">
                Ready to Farm with Confidence?
              </h2>
              <p className="hp-cta-sub">
                Every day without the right information is a day of potential loss. Join FarmEra and make every decision — from sowing to selling — backed by data.
              </p>
              <div>
                <Link to="/yield-prediction" className="hp-cta-btn">🌾 Predict My Yield</Link>
                <Link to="/rate-predictor"   className="hp-cta-btn">💰 Forecast Price</Link>
                <Link to="/chatbot"          className="hp-cta-btn">🤖 Ask AI Expert</Link>
                <Link to="/market"           className="hp-cta-btn">🏪 Visit Market</Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <Footer />
    </div>
  );
}