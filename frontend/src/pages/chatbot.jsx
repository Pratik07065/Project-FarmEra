import React, { useState, useEffect, useRef, useCallback } from 'react';
import NavScrollExample from '../navbar';
import Footer from '../common/footer';
import farmingDB from './farmingDatabase.json';

/* ══════════════════════════════════════════════════════════
   LOCAL JSON CHATBOT ENGINE
   - Keyword matching with fuzzy logic
   - Random answer selection (4-5 answers per topic)
   - Multi-category support
   - Typing simulation for realistic feel
══════════════════════════════════════════════════════════ */

// ── Utility: Pick random item from array ──────────────────
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Utility: Normalize text for matching ─────────────────
const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\u0900-\u097f\s]/g, '').trim();

// ── MAIN QUERY ENGINE ─────────────────────────────────────
const getResponse = (userInput) => {
  const query = normalize(userInput);
  const words = query.split(/\s+/);

  // 1. Check greeting
  if (farmingDB.greetings.keywords.some(k => query.includes(normalize(k)))) {
    return randomPick(farmingDB.greetings.answers);
  }

  // 2. Check help
  if (farmingDB.help.keywords.some(k => query.includes(normalize(k)))) {
    return randomPick(farmingDB.help.answers);
  }

  // 3. Score each category based on keyword matches
  const categories = [
    'wheat', 'onion', 'tomato', 'cotton', 'rice', 'grape', 'sugarcane',
    'crops', 'pestControl', 'diseases', 'soil', 'irrigation', 'marketRates',
    'government', 'organicFarming', 'storage', 'farmEra', 'weather'
  ];

  let bestMatch = null;
  let bestScore = 0;

  for (const cat of categories) {
    const section = farmingDB[cat];
    if (!section || !section.keywords) continue;

    let score = 0;

    // Check main keywords
    for (const keyword of section.keywords) {
      const kw = normalize(keyword);
      if (query.includes(kw)) {
        score += kw.split(' ').length * 3; // Multi-word keywords score higher
      }
    }

    // For crops with specific sub-entries
    if (section.specific) {
      for (const subKey of Object.keys(section.specific)) {
        const sub = section.specific[subKey];
        if (sub.keywords) {
          let subScore = 0;
          for (const kw of sub.keywords) {
            if (query.includes(normalize(kw))) subScore += normalize(kw).split(' ').length * 4;
          }
          if (subScore > bestScore) {
            bestScore = subScore;
            bestMatch = sub.answers
              ? randomPick(sub.answers)
              : sub.response || section.general;
          }
        }
      }
    }

    // Check nested structures
    if (section.fertilizer && section.fertilizer.keywords) {
      let subScore = 0;
      for (const kw of section.fertilizer.keywords) {
        if (query.includes(normalize(kw))) subScore += 4;
      }
      if (subScore > bestScore) {
        bestScore = subScore;
        bestMatch = section.fertilizer.answers
          ? randomPick(section.fertilizer.answers)
          : section.fertilizer.response;
      }
    }

    if (section.msp && section.msp.keywords) {
      let subScore = 0;
      for (const kw of section.msp.keywords) {
        if (query.includes(normalize(kw))) subScore += 4;
      }
      if (subScore > bestScore) {
        bestScore = subScore;
        bestMatch = section.msp.answers
          ? randomPick(section.msp.answers)
          : section.msp.response;
      }
    }

    if (section.onionRate && section.onionRate.keywords) {
      let subScore = 0;
      for (const kw of section.onionRate.keywords) {
        if (query.includes(normalize(kw))) subScore += 4;
      }
      if (subScore > bestScore) {
        bestScore = subScore;
        bestMatch = section.onionRate.answers
          ? randomPick(section.onionRate.answers)
          : section.onionRate.response;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = section.answers
        ? randomPick(section.answers)
        : section.general || (section.response);
    }
  }

  // 4. Return best match or default
  if (bestMatch && bestScore > 0) return bestMatch;

  return randomPick(farmingDB.default.answers);
};

/* ══════════════════════════════════════════════════════════
   STYLES — Organic/Natural theme with warm earth tones
══════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    --fc-green-deep: #1a4731;
    --fc-green-mid: #2d6a4f;
    --fc-green-main: #3a7d44;
    --fc-green-light: #52b788;
    --fc-green-pale: #b7e4c7;
    --fc-green-bg: #f0faf4;
    --fc-green-chat: #f7fbf8;
    --fc-accent: #f59e0b;
    --fc-accent-light: #fef3c7;
    --fc-text-dark: #0d2318;
    --fc-text-mid: #1a3a28;
    --fc-bubble-border: #d1f0dc;
  }

  /* ══ Page ══ */
  .fc-page {
    font-family: 'Nunito', sans-serif;
    background: linear-gradient(145deg, #eaf7ef 0%, #dff0e8 40%, #e8f4fb 100%);
    min-height: 100vh;
    display: flex; flex-direction: column;
    position: relative; overflow-x: hidden;
  }

  /* ══ Floating background ══ */
  .fc-bg {
    position: fixed; inset: 0;
    pointer-events: none; overflow: hidden; z-index: 0;
  }
  .fc-particle {
    position: absolute; opacity: 0.06;
    animation: fcFloat linear infinite;
  }
  @keyframes fcFloat {
    0%   { transform: translateY(108vh) rotate(0deg); opacity: 0; }
    8%   { opacity: 0.06; }
    92%  { opacity: 0.06; }
    100% { transform: translateY(-8vh) rotate(380deg); opacity: 0; }
  }

  /* ══ Content wrapper ══ */
  .fc-content {
    position: relative; z-index: 1;
    flex: 1; display: flex;
    align-items: center; justify-content: center;
    padding: 2rem 1rem;
  }

  /* ══ Chat window ══ */
  .fc-window {
    width: 100%; max-width: 840px;
    border-radius: 28px;
    border: 1.5px solid rgba(82, 183, 136, 0.2);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.04),
      0 20px 48px rgba(29, 73, 54, 0.12),
      inset 0 1px 0 rgba(255,255,255,0.7);
    display: flex; flex-direction: column;
    height: 78vh; min-height: 520px;
    overflow: hidden;
    animation: fcSlideUp 0.65s cubic-bezier(.34,1.52,.64,1) both;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px);
  }
  @keyframes fcSlideUp {
    from { opacity: 0; transform: translateY(40px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ══ Header ══ */
  .fc-header {
    background: linear-gradient(135deg, var(--fc-green-deep) 0%, var(--fc-green-mid) 50%, var(--fc-green-light) 100%);
    padding: 14px 22px;
    display: flex; align-items: center; gap: 14px;
    position: relative; overflow: hidden; flex-shrink: 0;
    border-radius: 26px 26px 0 0;
  }
  .fc-header::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .fc-header::after {
    content: '';
    position: absolute; top: 0; left: -60%; width: 35%; height: 100%;
    background: rgba(255,255,255,0.08); transform: skewX(-18deg);
    animation: fcSheen 4s ease-in-out infinite;
  }
  @keyframes fcSheen { 0% { left:-60%; } 100% { left:120%; } }

  .fc-header-avatar {
    width: 48px; height: 48px; border-radius: 15px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.55rem; flex-shrink: 0;
    animation: fcPopIn 0.5s cubic-bezier(.34,1.56,.64,1) 0.3s both;
    position: relative; z-index: 1;
  }
  .fc-header-info { flex: 1; position: relative; z-index: 1; }
  .fc-header-title {
    font-weight: 900; font-size: 1.08rem;
    color: #fff; margin: 0; letter-spacing: 0.01em;
    font-family: 'DM Serif Display', serif;
  }
  .fc-header-sub {
    font-size: 0.76rem; color: rgba(255,255,255,0.75);
    font-weight: 600; display: flex; align-items: center; gap: 5px; margin-top: 2px;
  }
  .fc-online-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #86efac; animation: fcPulse 2s ease infinite;
    box-shadow: 0 0 6px rgba(134, 239, 172, 0.6);
  }
  @keyframes fcPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.65); }
  }

  .fc-header-badges { display: flex; gap: 8px; position: relative; z-index: 1; }
  .fc-header-tag {
    background: rgba(255,255,255,0.15); border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 4px 12px; font-size: 0.72rem;
    font-weight: 800; color: #fff; letter-spacing: 0.05em;
  }
  .fc-header-local {
    background: rgba(245, 158, 11, 0.3); border-radius: 10px;
    border: 1px solid rgba(245, 158, 11, 0.4);
    padding: 4px 12px; font-size: 0.72rem;
    font-weight: 800; color: #fcd34d; letter-spacing: 0.03em;
  }

  /* ══ Chat body ══ */
  .fc-body {
    flex: 1; overflow-y: auto;
    padding: 20px 18px 12px;
    background: var(--fc-green-chat);
    display: flex; flex-direction: column; gap: 6px;
  }
  .fc-body::-webkit-scrollbar { width: 4px; }
  .fc-body::-webkit-scrollbar-track { background: transparent; }
  .fc-body::-webkit-scrollbar-thumb { background: #c3e6cc; border-radius: 2px; }

  /* ══ Date separator ══ */
  .fc-date-sep {
    text-align: center; margin: 8px 0;
    font-size: 0.7rem; color: #6b9e7e; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px;
  }
  .fc-date-sep::before, .fc-date-sep::after {
    content: ''; flex: 1; height: 1px; background: #d4edda;
  }

  /* ══ Message rows ══ */
  .fc-msg-row {
    display: flex; gap: 9px;
    animation: fcMsgIn 0.32s cubic-bezier(.34,1.52,.64,1) both;
  }
  .fc-msg-row.user  { justify-content: flex-end; }
  .fc-msg-row.bot   { justify-content: flex-start; align-items: flex-end; }

  @keyframes fcMsgIn {
    from { opacity: 0; transform: translateY(12px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .fc-bot-avatar {
    width: 34px; height: 34px; border-radius: 11px;
    background: linear-gradient(135deg, var(--fc-green-mid), var(--fc-green-light));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(58,125,68,0.25);
  }

  /* ══ Bubbles ══ */
  .fc-bubble {
    max-width: 73%; padding: 11px 15px;
    border-radius: 18px; font-size: 0.875rem; line-height: 1.6;
    font-weight: 600; white-space: pre-wrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.15s ease;
  }
  .fc-bubble:hover { transform: translateY(-1px); }

  .fc-bubble.user {
    background: linear-gradient(135deg, var(--fc-green-main), var(--fc-green-light));
    color: #fff;
    border-bottom-right-radius: 5px;
    box-shadow: 0 2px 12px rgba(58,125,68,0.3);
  }
  .fc-bubble.bot {
    background: #fff;
    color: var(--fc-text-dark);
    border: 1px solid var(--fc-bubble-border);
    border-bottom-left-radius: 5px;
  }

  .fc-bubble-sender {
    font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.05em; margin-bottom: 5px; opacity: 0.75;
  }
  .fc-bubble.user .fc-bubble-sender { color: rgba(255,255,255,0.85); }
  .fc-bubble.bot  .fc-bubble-sender { color: var(--fc-green-mid); }

  .fc-bubble-text { margin: 0; font-size: 0.875rem; line-height: 1.65; }
  .fc-bubble-time {
    font-size: 0.65rem; font-weight: 600; margin-top: 5px;
    opacity: 0.55; text-align: right;
  }
  .fc-bubble.user .fc-bubble-time { color: rgba(255,255,255,0.75); }
  .fc-bubble.bot .fc-bubble-time { color: #6b9e7e; }

  /* ══ Typing indicator ══ */
  .fc-typing-wrap { display: flex; gap: 9px; align-items: flex-end; }
  .fc-typing {
    display: flex; align-items: center; gap: 5px;
    padding: 12px 16px; background: #fff;
    border: 1px solid var(--fc-bubble-border);
    border-radius: 18px; border-bottom-left-radius: 5px;
    max-width: 80px;
    animation: fcMsgIn 0.3s ease both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .fc-typing-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--fc-green-main);
    animation: fcTypingBounce 1.3s ease-in-out infinite;
  }
  .fc-typing-dot:nth-child(2) { animation-delay: 0.18s; }
  .fc-typing-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes fcTypingBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.35; }
    30%          { transform: translateY(-7px); opacity: 1; }
  }
  .fc-typing-label {
    font-size: 0.7rem; color: #6b9e7e; font-weight: 700;
    margin-bottom: 4px; margin-left: 2px;
    animation: fcFadeIn 0.3s ease both;
  }
  @keyframes fcFadeIn { from { opacity:0; } to { opacity:1; } }

  /* ══ Quick prompts ══ */
  .fc-quick-section {
    background: #f0f9f4;
    border-top: 1px solid #e0f0e8;
    padding: 10px 16px;
    flex-shrink: 0;
  }
  .fc-quick-label {
    font-size: 0.68rem; font-weight: 800; color: #5a8a72;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 7px;
  }
  .fc-quick-wrap {
    display: flex; flex-wrap: wrap; gap: 6px;
  }
  .fc-quick-btn {
    font-family: 'Nunito', sans-serif;
    font-size: 0.76rem; font-weight: 700;
    padding: 5px 12px; border-radius: 20px;
    border: 1.5px solid var(--fc-green-pale);
    background: #fff; color: var(--fc-green-deep);
    cursor: pointer;
    transition: all 0.18s cubic-bezier(.34,1.52,.64,1);
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .fc-quick-btn:hover:not(:disabled) {
    background: var(--fc-green-main); color: #fff;
    border-color: var(--fc-green-main);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(58,125,68,0.25);
  }
  .fc-quick-btn:active { transform: scale(0.95); }
  .fc-quick-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ══ Input footer ══ */
  .fc-footer {
    background: #fff;
    padding: 12px 16px 14px;
    border-top: 1px solid #e8f5e2;
    flex-shrink: 0;
  }
  .fc-input-row {
    display: flex; gap: 10px; align-items: center;
  }
  .fc-input {
    flex: 1;
    border: 1.5px solid var(--fc-green-pale) !important;
    border-radius: 15px !important;
    padding: 11px 16px !important;
    font-family: 'Nunito', sans-serif !important;
    font-weight: 600 !important; font-size: 0.9rem !important;
    color: var(--fc-text-dark) !important;
    background: var(--fc-green-chat) !important;
    outline: none !important;
    transition: all 0.2s ease !important;
  }
  .fc-input:focus {
    border-color: var(--fc-green-main) !important;
    box-shadow: 0 0 0 3px rgba(58,125,68,0.1) !important;
    background: #fff !important;
    transform: translateY(-1px) !important;
  }
  .fc-input::placeholder { color: #a0b8a8 !important; font-weight: 400 !important; }
  .fc-input:disabled { opacity: 0.55 !important; }

  .fc-send-btn {
    width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
    border: none;
    background: linear-gradient(135deg, var(--fc-green-main), var(--fc-green-light));
    color: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(58,125,68,0.35);
    transition: transform 0.18s, box-shadow 0.18s, filter 0.18s;
    position: relative; overflow: hidden;
  }
  .fc-send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(58,125,68,0.45);
    filter: brightness(1.07);
  }
  .fc-send-btn:active:not(:disabled) { transform: scale(0.93); }
  .fc-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .fc-ripple {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.35);
    transform: scale(0); animation: fcRipple 0.55s linear; pointer-events: none;
  }
  @keyframes fcRipple { to { transform:scale(5); opacity:0; } }

  .fc-footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 6px;
  }
  .fc-char-count {
    font-size: 0.68rem; color: #9ca3af; font-weight: 600;
  }
  .fc-powered {
    font-size: 0.65rem; color: #a5b4ad; font-weight: 700;
    letter-spacing: 0.04em;
  }

  /* ══ Animations ══ */
  @keyframes fcPopIn {
    from { opacity:0; transform:scale(0.5) rotate(-10deg); }
    to   { opacity:1; transform:scale(1) rotate(0deg); }
  }

  /* ══ Mobile ══ */
  @media (max-width: 600px) {
    .fc-window { height: 82vh; border-radius: 20px; }
    .fc-bubble { max-width: 88%; font-size: 0.83rem; }
    .fc-header-badges { display: none; }
    .fc-quick-wrap { gap: 5px; }
    .fc-quick-btn { font-size: 0.72rem; padding: 4px 10px; }
  }
`;

/* ── Floating bg particles ── */
const BG_SVGS = [
  `<svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19.52A10 10 0 0115 22c.52-2.36 1-5.8 2-8 1.5-3.5 5-4 5-4s-3 .5-5 3c0 0 2.5-5 10-5 0 0-4 1-8 6-1 1.5-1.5 3-1.5 3S19 12 17 8z" fill="#3a7d44"/></svg>`,
  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#2d6a4f"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="#b7e4c7" font-weight="bold">₹</text></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7L2 9l7-1z" fill="#f59e0b"/></svg>`,
  `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="7" ry="5" fill="#52b788"/><ellipse cx="12" cy="12" rx="5" ry="4" fill="#74c69d"/></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#3a7d44"/></svg>`,
];

const FloatingBg = () => {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i, left: `${3 + i * 8}%`,
    size: `${12 + (i % 4) * 5}px`,
    dur: `${14 + (i % 5) * 3}s`,
    delay: `${i * 1.6}s`,
    svg: BG_SVGS[i % 5],
  }));
  return (
    <div className="fc-bg">
      {items.map(p => (
        <div key={p.id} className="fc-particle"
          style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }}
          dangerouslySetInnerHTML={{ __html: p.svg }} />
      ))}
    </div>
  );
};

/* ── Ripple effect ── */
const addRipple = (e) => {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const r = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  r.className = 'fc-ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
};

/* ── Quick prompts ── */
const QUICK_PROMPTS = [
  "🌱 Rabi season crops?",
  "🧅 Onion pest control",
  "💧 Drip irrigation tips",
  "📈 Today's market rates",
  "🌿 Powdery mildew cure",
  "🏛️ PM Kisan scheme",
  "🧪 Fertilizer for wheat",
  "🌾 Organic farming tips",
];

/* ── Time formatter ── */
const getTime = () => {
  const d = new Date();
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

/* ── Simulate realistic typing delay ── */
const getTypingDelay = (text) => {
  const base = 700;
  const perChar = 8;
  const max = 2200;
  return Math.min(base + text.length * perChar, max);
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const FarmerChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: randomPick(farmingDB.greetings.answers),
      time: getTime(),
      id: 1
    }
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef                 = useRef(null);
  const inputRef                = useRef(null);
  const msgIdRef                = useRef(2);

  // ── Auto-scroll ──────────────────────────────────────
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // ── Inject styles ────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('fc-styles')) {
      const tag = document.createElement('style');
      tag.id = 'fc-styles';
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => {
      const t = document.getElementById('fc-styles');
      if (t) t.remove();
    };
  }, []);

  // ── Send message ─────────────────────────────────────
  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      sender: 'user',
      text: trimmed,
      time: getTime(),
      id: msgIdRef.current++
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Get response from JSON DB
    const response = getResponse(trimmed);
    const delay = getTypingDelay(response);

    setTimeout(() => {
      const botMsg = {
        sender: 'bot',
        text: response,
        time: getTime(),
        id: msgIdRef.current++
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, [isTyping]);

  // ── Form submit ──────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Quick prompt click ───────────────────────────────
  const handleQuick = (prompt) => {
    if (isTyping) return;
    // Strip emoji prefix for cleaner query
    const clean = prompt.replace(/^\S+\s/, '');
    sendMessage(clean);
  };

  /* ── Render ── */
  return (
    <div className="fc-page">
      <NavScrollExample />
      <FloatingBg />

      <div className="fc-content">
        <div className="fc-window">

          {/* ── Header ── */}
          <div className="fc-header">
            <div className="fc-header-avatar">🌾</div>
            <div className="fc-header-info">
              <p className="fc-header-title">FarmEra AI Assistant</p>
              <span className="fc-header-sub">
                <span className="fc-online-dot" />
                Online · Farming Expert Bot
              </span>
            </div>
            <div className="fc-header-badges">
              <div className="fc-header-local">📦 Offline</div>
              <div className="fc-header-tag">FarmEra</div>
            </div>
          </div>

          {/* ── Chat body ── */}
          <div className="fc-body" ref={chatRef}>
            <div className="fc-date-sep">Today</div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`fc-msg-row ${msg.sender}`}
                style={{ animationDelay: '0s' }}
              >
                {msg.sender === 'bot' && (
                  <div className="fc-bot-avatar">🤖</div>
                )}
                <div className={`fc-bubble ${msg.sender}`}>
                  <div className="fc-bubble-sender">
                    {msg.sender === 'user' ? '👤 You' : '🌾 FarmEra Expert'}
                  </div>
                  <p className="fc-bubble-text">{msg.text}</p>
                  <div className="fc-bubble-time">{msg.time}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="fc-typing-wrap">
                <div className="fc-bot-avatar">🤖</div>
                <div>
                  <div className="fc-typing-label">Expert is typing...</div>
                  <div className="fc-typing">
                    <div className="fc-typing-dot" />
                    <div className="fc-typing-dot" />
                    <div className="fc-typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Quick prompts ── */}
          <div className="fc-quick-section">
            <div className="fc-quick-label">💡 Quick Questions</div>
            <div className="fc-quick-wrap">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  className="fc-quick-btn"
                  onClick={() => handleQuick(prompt)}
                  disabled={isTyping}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* ── Input footer ── */}
          <div className="fc-footer">
            <form onSubmit={handleSubmit}>
              <div className="fc-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  className="fc-input"
                  placeholder="Ask about crops, pests, market rates, diseases..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="fc-send-btn"
                  disabled={isTyping || !input.trim()}
                  onClick={(!isTyping && input.trim()) ? addRipple : undefined}
                  title="Send"
                >
                  {isTyping ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5"
                        strokeDasharray="28" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate"
                          from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                        stroke="white" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="fc-footer-bottom">
                <div className="fc-char-count">
                  {input.length > 0 ? `${input.length} chars` : 'Ask in English or Hindi...'}
                </div>
                <div className="fc-powered">⚡ Powered by Local DB · No Internet Needed</div>
              </div>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerChatbot;