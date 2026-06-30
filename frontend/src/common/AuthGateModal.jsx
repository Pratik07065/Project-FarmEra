import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearStoredAdmin,
  clearStoredUser,
  loginWithFarmerOrAdmin,
  setStoredAdmin,
  setStoredUser,
} from "./authStorage";

const AUTH_GATE_STYLES = `
  .fe-auth-overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .fe-auth-modal {
    width: 100%;
    max-width: 460px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    border: 1px solid rgba(58, 125, 68, 0.2);
  }
  .fe-auth-head {
    padding: 16px 18px;
    background: linear-gradient(135deg, #1b4332, #2d6a4f);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fe-auth-head h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
  }
  .fe-auth-close {
    border: none;
    background: transparent;
    color: #fff;
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
  }
  .fe-auth-body {
    padding: 18px;
  }
  .fe-auth-note {
    margin-bottom: 12px;
    font-size: 0.84rem;
    color: #4b5563;
    font-weight: 600;
  }
  .fe-auth-field {
    display: grid;
    gap: 6px;
    margin-bottom: 10px;
  }
  .fe-auth-field label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #374151;
  }
  .fe-auth-field input {
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 10px 11px;
    font-size: 0.9rem;
  }
  .fe-auth-error {
    margin: 6px 0 10px;
    color: #b91c1c;
    font-size: 0.82rem;
    font-weight: 600;
  }
  .fe-auth-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
  }
  .fe-auth-submit {
    flex: 1;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #3a7d44, #52b788);
    color: #fff;
    font-weight: 800;
    padding: 10px 12px;
    cursor: pointer;
  }
  .fe-auth-skip {
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #fff;
    color: #374151;
    font-weight: 700;
    padding: 10px 12px;
    cursor: pointer;
  }
  .fe-auth-open-page {
    border: 1px solid #3a7d44;
    border-radius: 10px;
    background: #fff;
    color: #1b4332;
    font-weight: 700;
    padding: 10px 12px;
    cursor: pointer;
  }
`;

export default function AuthGateModal({ open, onClose, onAuthSuccess, onOpenAuthPage, onAdminSuccess }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ farmerId: "", password: "" });

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginWithFarmerOrAdmin(loginForm);
      if (result.type === "admin") {
        clearStoredUser();
        setStoredAdmin({
          adminId: result.data.adminId,
          password: loginForm.password,
          role: "admin",
        });
        setLoginForm({ farmerId: "", password: "" });
        if (onAdminSuccess) onAdminSuccess(result.data);
        else navigate("/admin-panel");
        return;
      }
      clearStoredAdmin();
      setStoredUser(result.data);
      onAuthSuccess(result.data);
      setLoginForm({ farmerId: "", password: "" });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{AUTH_GATE_STYLES}</style>
      <div className="fe-auth-overlay">
        <div className="fe-auth-modal">
          <div className="fe-auth-head">
            <h4>Welcome to FarmEra</h4>
            <button
              type="button"
              className="fe-auth-close"
              aria-label="Close auth popup"
              onClick={onClose}
            >
              x
            </button>
          </div>
          <div className="fe-auth-body">
            <div className="fe-auth-note">
              Login here quickly, or open full auth page for signup.
            </div>

            <form onSubmit={submit}>
              <div className="fe-auth-field">
                <label>Farmer ID</label>
                <input
                  name="farmerId"
                  placeholder="FARM1234"
                  value={loginForm.farmerId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="fe-auth-field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <div className="fe-auth-error">{error}</div>}

              <div className="fe-auth-actions">
                <button type="submit" className="fe-auth-submit" disabled={loading}>
                  {loading ? "Please wait..." : "Login"}
                </button>
                <button
                  type="button"
                  className="fe-auth-open-page"
                  onClick={onOpenAuthPage}
                >
                  Sign Up on Auth Page
                </button>
                <button type="button" className="fe-auth-skip" onClick={onClose}>
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
