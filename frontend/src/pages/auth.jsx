import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Footer from "../common/footer";
import NavScrollExample from "../navbar";
import {
  clearStoredAdmin,
  clearStoredUser,
  loginWithFarmerOrAdmin,
  setStoredAdmin,
  setStoredUser,
} from "../common/authStorage";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --soil: #2C1A0E;
    --bark: #5C3D1E;
    --leaf: #3A7D44;
    --sprout: #5BB96C;
    --wheat: #E8C97A;
    --cream: #FDF6E3;
    --mist: #F0EAD6;
    --error: #D94F3D;
    --success: #3A7D44;
    --shadow: 0 25px 60px rgba(44,26,14,0.18);
    --glow: 0 0 40px rgba(91,185,108,0.15);
  }

  .auth-root {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 40px 16px;
  }

  /* Animated field background */
  .auth-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 10% 90%, rgba(58,125,68,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 10%, rgba(232,201,122,0.18) 0%, transparent 50%),
      radial-gradient(ellipse 50% 70% at 50% 50%, rgba(253,246,227,0.8) 0%, transparent 100%);
    z-index: 0;
    pointer-events: none;
  }

  /* Floating grain overlay */
  .auth-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    z-index: 1;
    pointer-events: none;
    opacity: 0.6;
  }

  /* Decorative floating blobs */
  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: blobFloat 8s ease-in-out infinite;
  }
  .blob-1 {
    width: 500px; height: 500px;
    background: rgba(91,185,108,0.08);
    top: -150px; left: -150px;
    animation-delay: 0s;
  }
  .blob-2 {
    width: 400px; height: 400px;
    background: rgba(232,201,122,0.12);
    bottom: -100px; right: -100px;
    animation-delay: -4s;
  }
  .blob-3 {
    width: 300px; height: 300px;
    background: rgba(58,125,68,0.06);
    top: 50%; right: 10%;
    animation-delay: -2s;
  }

  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -20px) scale(1.05); }
    66% { transform: translate(-15px, 15px) scale(0.95); }
  }

  /* Card */
  .auth-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 520px;
    background: rgba(253,246,227,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(232,201,122,0.4);
    border-radius: 28px;
    box-shadow: var(--shadow), var(--glow);
    overflow: hidden;
    animation: cardEntry 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes cardEntry {
    from { opacity: 0; transform: translateY(40px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Header strip */
  .auth-header {
    background: linear-gradient(135deg, var(--soil) 0%, var(--bark) 100%);
    padding: 36px 40px 28px;
    position: relative;
    overflow: hidden;
  }

  .auth-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 20px,
      rgba(255,255,255,0.02) 20px,
      rgba(255,255,255,0.02) 40px
    );
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--leaf), var(--sprout));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 16px rgba(91,185,108,0.4);
    animation: iconPulse 3s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%, 100% { box-shadow: 0 4px 16px rgba(91,185,108,0.4); }
    50% { box-shadow: 0 4px 30px rgba(91,185,108,0.7); }
  }

  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: var(--cream);
    letter-spacing: -0.5px;
  }

  .logo-text span { color: var(--wheat); }

  .header-tagline {
    font-size: 13px;
    color: rgba(232,201,122,0.8);
    letter-spacing: 0.5px;
    font-weight: 300;
  }

  /* Tab switcher */
  .tab-bar {
    display: flex;
    background: rgba(44,26,14,0.15);
    border-radius: 14px;
    padding: 4px;
    margin-top: 20px;
    position: relative;
    z-index: 1;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    color: rgba(253,246,227,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 0.3px;
  }

  .tab-btn.active {
    background: var(--wheat);
    color: var(--soil);
    font-weight: 600;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  /* Form body */
  .auth-body {
    padding: 32px 40px 36px;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--soil);
    margin-bottom: 6px;
  }

  .form-subtitle {
    font-size: 13px;
    color: var(--bark);
    margin-bottom: 28px;
    opacity: 0.7;
  }

  /* Field groups */
  .fields-grid {
    display: grid;
    gap: 16px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 480px) {
    .field-row { grid-template-columns: 1fr; }
    .auth-body { padding: 24px 20px 28px; }
    .auth-header { padding: 28px 20px 22px; }
  }

  /* Individual field */
  .field-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
    animation: fieldSlide 0.5s ease both;
  }

  @keyframes fieldSlide {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .field-wrap:nth-child(1) { animation-delay: 0.05s; }
  .field-wrap:nth-child(2) { animation-delay: 0.10s; }
  .field-wrap:nth-child(3) { animation-delay: 0.15s; }
  .field-wrap:nth-child(4) { animation-delay: 0.20s; }
  .field-wrap:nth-child(5) { animation-delay: 0.25s; }
  .field-wrap:nth-child(6) { animation-delay: 0.30s; }
  .field-wrap:nth-child(7) { animation-delay: 0.35s; }

  .field-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--bark);
    letter-spacing: 0.8px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .label-icon { font-size: 13px; }

  .field-input-wrap {
    position: relative;
  }

  .field-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1.5px solid rgba(92,61,30,0.15);
    border-radius: 12px;
    background: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--soil);
    outline: none;
    transition: all 0.25s ease;
  }

  .field-input::placeholder { color: rgba(92,61,30,0.35); }

  .field-input:focus {
    border-color: var(--leaf);
    background: rgba(255,255,255,0.9);
    box-shadow: 0 0 0 3px rgba(58,125,68,0.12), 0 4px 12px rgba(58,125,68,0.08);
  }

  .field-input.error {
    border-color: var(--error);
    background: rgba(217,79,61,0.04);
    box-shadow: 0 0 0 3px rgba(217,79,61,0.1);
  }

  .field-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    pointer-events: none;
  }

  .eye-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 2px;
    color: var(--bark);
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  .eye-toggle:hover { opacity: 1; }

  .error-msg {
    font-size: 11px;
    color: var(--error);
    display: flex;
    align-items: center;
    gap: 4px;
    animation: shake 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  /* Select */
  .field-select {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1.5px solid rgba(92,61,30,0.15);
    border-radius: 12px;
    background: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--soil);
    outline: none;
    cursor: pointer;
    appearance: none;
    transition: all 0.25s ease;
  }
  .field-select:focus {
    border-color: var(--leaf);
    background: rgba(255,255,255,0.9);
    box-shadow: 0 0 0 3px rgba(58,125,68,0.12);
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
  }
  .divider-line { flex: 1; height: 1px; background: rgba(92,61,30,0.12); }
  .divider-text { font-size: 12px; color: rgba(92,61,30,0.4); font-weight: 500; }

  /* Submit button */
  .submit-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--leaf) 0%, var(--sprout) 100%);
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 6px 20px rgba(58,125,68,0.35);
    margin-top: 8px;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(58,125,68,0.45);
  }
  .submit-btn:hover::before { opacity: 1; }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Ripple */
  .btn-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  @keyframes ripple {
    to { transform: scale(4); opacity: 0; }
  }

  /* Loading spinner */
  .btn-spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--soil);
    color: var(--cream);
    padding: 14px 24px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 30px rgba(44,26,14,0.3);
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
    opacity: 0;
    white-space: nowrap;
  }
  .toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  .toast.success { background: var(--leaf); }
  .toast.error-toast { background: var(--error); }

  /* Password strength */
  .strength-bar-wrap {
    display: flex;
    gap: 4px;
    margin-top: 4px;
  }
  .strength-seg {
    flex: 1; height: 3px; border-radius: 2px;
    background: rgba(92,61,30,0.1);
    transition: background 0.3s ease;
  }
  .strength-seg.weak { background: var(--error); }
  .strength-seg.medium { background: var(--wheat); }
  .strength-seg.strong { background: var(--leaf); }

  .strength-label {
    font-size: 10.5px;
    margin-top: 2px;
    font-weight: 500;
  }
  .weak-label { color: var(--error); }
  .medium-label { color: #C8901A; }
  .strong-label { color: var(--leaf); }

  /* Checkbox */
  .checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 4px;
  }
  .checkbox-row input[type="checkbox"] {
    width: 16px; height: 16px;
    accent-color: var(--leaf);
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .checkbox-row label {
    font-size: 12.5px;
    color: var(--bark);
    cursor: pointer;
    line-height: 1.5;
  }
  .checkbox-row a { color: var(--leaf); text-decoration: none; font-weight: 600; }

  /* Forgot password */
  .forgot-link {
    text-align: right;
    margin-top: -8px;
  }
  .forgot-link a {
    font-size: 12px;
    color: var(--leaf);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  .forgot-link a:hover { opacity: 0.7; }

  /* Success state */
  .success-screen {
    text-align: center;
    padding: 20px 0;
    animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes successPop {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  .success-icon {
    font-size: 56px;
    display: block;
    margin-bottom: 16px;
    animation: iconBounce 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes iconBounce {
    from { transform: scale(0) rotate(-15deg); }
    to { transform: scale(1) rotate(0deg); }
  }
  .success-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: var(--leaf);
    margin-bottom: 8px;
  }
  .success-msg {
    font-size: 14px;
    color: var(--bark);
    opacity: 0.8;
    line-height: 1.6;
  }

  /* Section divider for signup */
  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--wheat);
    background: var(--soil);
    display: inline-block;
    padding: 3px 10px;
    border-radius: 4px;
    margin-bottom: 12px;
  }
`;

// ── Validation helpers ──────────────────────────────────────
const validators = {
  farmerId: v => /^[A-Za-z0-9]{4,15}$/.test(v) ? '' : 'Farmer ID: 4–15 alphanumeric chars',
  userName: v => v.trim().length >= 3 ? '' : 'Name must be at least 3 characters',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address',
  mobile: v => /^[6-9]\d{9}$/.test(v) ? '' : 'Enter a valid 10-digit mobile number',
  state: v => v ? '' : 'Please select your state',
  landSize: v => (!v || (parseFloat(v) > 0 && parseFloat(v) <= 9999)) ? '' : 'Enter valid land size (acres)',
  password: v => v.length >= 8 ? '' : 'Password must be at least 8 characters',
  confirmPassword: (v, pwd) => v === pwd ? '' : 'Passwords do not match',
};

const getPasswordStrength = pwd => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha',
  'Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Other'
];

// ── Toast component ─────────────────────────────────────────
function Toast({ message, type, show }) {
  return (
    <div className={`toast ${type === 'success' ? 'success' : type === 'error' ? 'error-toast' : ''} ${show ? 'show' : ''}`}>
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} {message}
    </div>
  );
}

// ── Field component ─────────────────────────────────────────
function Field({ label, icon, error, children }) {
  return (
    <div className="field-wrap">
      <label className="field-label">
        <span className="label-icon">{icon}</span> {label}
      </label>
      {children}
      {error && <span className="error-msg">⚠ {error}</span>}
    </div>
  );
}

// ── LOGIN FORM ──────────────────────────────────────────────
function LoginForm({ onSuccess, onAdminSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ farmerId: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.farmerId.trim()) errs.farmerId = 'Farmer ID is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const result = await loginWithFarmerOrAdmin(form);
      if (result.type === 'admin') {
        clearStoredUser();
        setStoredAdmin({
          adminId: result.data.adminId,
          password: form.password,
          role: 'admin',
        });
        if (onAdminSuccess) onAdminSuccess(result.data);
        else navigate('/admin-panel');
        return;
      }
      clearStoredAdmin();
      setStoredUser(result.data);
      onSuccess('login', result.data);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <p className="form-title">Welcome Back 🌾</p>
      <p className="form-subtitle">Login to manage your farm</p>

      <div className="fields-grid">
        <Field label="Farmer ID" icon="🪪" error={errors.farmerId}>
          <div className="field-input-wrap">
            <span className="field-icon">🪪</span>
            <input
              className={`field-input ${errors.farmerId ? 'error' : ''}`}
              name="farmerId" placeholder="e.g. FARM2024"
              value={form.farmerId} onChange={handle} autoComplete="username"
            />
          </div>
        </Field>

        <Field label="Password" icon="🔒" error={errors.password}>
          <div className="field-input-wrap">
            <span className="field-icon">🔒</span>
            <input
              className={`field-input ${errors.password ? 'error' : ''}`}
              name="password" type={showPwd ? 'text' : 'password'}
              placeholder="Your password"
              value={form.password} onChange={handle} autoComplete="current-password"
            />
            <button type="button" className="eye-toggle" onClick={() => setShowPwd(p => !p)}>
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>
        </Field>

        <div className="forgot-link">
          <a href="#forgot">Forgot password?</a>
        </div>

        {errors.server && <span className="error-msg">⚠ {errors.server}</span>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading && <span className="btn-spinner" />}
          {loading ? 'Logging in...' : 'Login to FarmEra 🌿'}
        </button>
      </div>
    </form>
  );
}

// ── SIGNUP FORM ─────────────────────────────────────────────
function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    farmerId: '', userName: '', email: '', mobile: '',
    state: '', landSize: '', cropType: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(validators).forEach(key => {
      if (key === 'confirmPassword') {
        const msg = validators[key](form[key], form.password);
        if (msg) errs[key] = msg;
      } else if (key in form && form[key] !== undefined) {
        const msg = validators[key](form[key]);
        if (msg) errs[key] = msg;
      }
    });
    if (!agreed) errs.agreed = 'Please accept the terms';
    return errs;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      const res = await fetch('http://localhost:5000/farmer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      onSuccess('signup', data);
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthClasses = ['', 'weak-label', 'medium-label', 'medium-label', 'strong-label'];

  return (
    <form onSubmit={submit} noValidate>
      <p className="form-title">Join FarmEra 🌱</p>
      <p className="form-subtitle">Create your farmer account in minutes</p>

      <div className="fields-grid">
        {/* Identity */}
        <span className="section-label">🪪 Identity</span>
        <div className="field-row">
          <Field label="Farmer ID" icon="🪪" error={errors.farmerId}>
            <div className="field-input-wrap">
              <span className="field-icon">🪪</span>
              <input className={`field-input ${errors.farmerId ? 'error' : ''}`}
                name="farmerId" placeholder="e.g. FARM2024"
                value={form.farmerId} onChange={handle} />
            </div>
          </Field>

          <Field label="Full Name" icon="👤" error={errors.userName}>
            <div className="field-input-wrap">
              <span className="field-icon">👤</span>
              <input className={`field-input ${errors.userName ? 'error' : ''}`}
                name="userName" placeholder="Your full name"
                value={form.userName} onChange={handle} />
            </div>
          </Field>
        </div>

        {/* Contact */}
        <span className="section-label">📞 Contact</span>
        <div className="field-row">
          <Field label="Email Address" icon="📧" error={errors.email}>
            <div className="field-input-wrap">
              <span className="field-icon">📧</span>
              <input className={`field-input ${errors.email ? 'error' : ''}`}
                name="email" type="email" placeholder="email@example.com"
                value={form.email} onChange={handle} />
            </div>
          </Field>

          <Field label="Mobile Number" icon="📱" error={errors.mobile}>
            <div className="field-input-wrap">
              <span className="field-icon">📱</span>
              <input className={`field-input ${errors.mobile ? 'error' : ''}`}
                name="mobile" placeholder="10-digit number"
                value={form.mobile} onChange={handle} maxLength={10} />
            </div>
          </Field>
        </div>

        {/* Farm details */}
        <span className="section-label">🌾 Farm Details</span>
        <div className="field-row">
          <Field label="State" icon="📍" error={errors.state}>
            <div className="field-input-wrap">
              <span className="field-icon">📍</span>
              <select className={`field-select ${errors.state ? 'error' : ''}`}
                name="state" value={form.state} onChange={handle}>
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Field>

          <Field label="Land Size (Acres)" icon="🗺️" error={errors.landSize}>
            <div className="field-input-wrap">
              <span className="field-icon">🗺️</span>
              <input className={`field-input ${errors.landSize ? 'error' : ''}`}
                name="landSize" type="number" placeholder="e.g. 5.5"
                value={form.landSize} onChange={handle} min="0" step="0.1" />
            </div>
          </Field>
        </div>

        <Field label="Primary Crop Type (optional)" icon="🌿" error={errors.cropType}>
          <div className="field-input-wrap">
            <span className="field-icon">🌿</span>
            <input className="field-input"
              name="cropType" placeholder="e.g. Wheat, Rice, Cotton"
              value={form.cropType} onChange={handle} />
          </div>
        </Field>

        {/* Security */}
        <span className="section-label">🔒 Security</span>
        <div className="field-row">
          <Field label="Password" icon="🔒" error={errors.password}>
            <div className="field-input-wrap">
              <span className="field-icon">🔒</span>
              <input className={`field-input ${errors.password ? 'error' : ''}`}
                name="password" type={showPwd ? 'text' : 'password'}
                placeholder="Min 8 characters"
                value={form.password} onChange={handle} autoComplete="new-password" />
              <button type="button" className="eye-toggle" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <>
                <div className="strength-bar-wrap">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`strength-seg ${
                      strength >= i ? (strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong') : ''
                    }`} />
                  ))}
                </div>
                {strength > 0 && (
                  <span className={`strength-label ${strengthClasses[strength]}`}>
                    {strengthLabels[strength]} password
                  </span>
                )}
              </>
            )}
          </Field>

          <Field label="Confirm Password" icon="🔑" error={errors.confirmPassword}>
            <div className="field-input-wrap">
              <span className="field-icon">🔑</span>
              <input className={`field-input ${errors.confirmPassword ? 'error' : ''}`}
                name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form.confirmPassword} onChange={handle} autoComplete="new-password" />
              <button type="button" className="eye-toggle" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </Field>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <label htmlFor="terms">
            I agree to FarmEra's <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
          </label>
        </div>
        {errors.agreed && <span className="error-msg">⚠ {errors.agreed}</span>}

        {errors.server && <span className="error-msg">⚠ {errors.server}</span>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading && <span className="btn-spinner" />}
          {loading ? 'Creating account...' : 'Create My Farm Account 🌾'}
        </button>
      </div>
    </form>
  );
}

// ── SUCCESS SCREEN ──────────────────────────────────────────
function SuccessScreen({ type, onReset }) {
  useEffect(() => {
    const t = setTimeout(onReset, 4000);
    return () => clearTimeout(t);
  }, [onReset]);

  return (
    <div className="success-screen">
      <span className="success-icon">{type === 'login' ? '🌾' : '🌱'}</span>
      <p className="success-title">{type === 'login' ? 'Welcome Back!' : 'Account Created!'}</p>
      <p className="success-msg">
        {type === 'login'
          ? 'You have successfully logged in to FarmEra. Redirecting to your dashboard...'
          : 'Your farmer account has been created. You can now log in and manage your farm.'}
      </p>
    </div>
  );
}

// ── MAIN EXPORT ─────────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [tab, setTab] = useState(initialTab);
  const [successType, setSuccessType] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(p => ({ ...p, show: false })), 3500);
  };

  const handleSuccess = (type, data) => {
    if (type === 'login') {
      setStoredUser(data);
    }
    setSuccessType(type);
    showToast(
      type === 'login' ? `Welcome back, ${data.userName || 'Farmer'}! 🌾` : 'Account created successfully! 🌱',
      'success'
    );
    if (type === 'login') {
      setTimeout(() => navigate('/'), 1500);
    }
  };

  const handleAdminSuccess = () => {
    navigate('/admin-panel');
  };

  const handleReset = () => setSuccessType(null);

  return (
    <>
    <div>
        <NavScrollExample/>
      <style>{styles}</style>

      <div className="auth-root">
        {/* Background blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="logo-row">
              <div className="logo-icon">🌾</div>
              <span className="logo-text">Farm<span>Era</span></span>
            </div>
            <p className="header-tagline">Empowering farmers with smart technology</p>

            {!successType && (
              <div className="tab-bar">
                <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
                  🔑 Login
                </button>
                <button className={`tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>
                  🌱 Create Account
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="auth-body">
            {successType ? (
              <SuccessScreen type={successType} onReset={handleReset} />
            ) : tab === 'login' ? (
              <LoginForm onSuccess={handleSuccess} onAdminSuccess={handleAdminSuccess} />
            ) : (
              <SignupForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>

        <Toast {...toast} />
      </div>
      <Footer/>
      </div>
    </>
  );
}