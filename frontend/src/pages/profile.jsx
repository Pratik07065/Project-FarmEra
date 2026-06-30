import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavScrollExample from "../navbar";
import Footer from "../common/footer";
import { API_BASE } from "../common/api";
import { getStoredUser } from "../common/authStorage";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  .pf-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0faf0 0%, #e8f5e2 50%, #f5faf0 100%);
    font-family: 'Nunito', sans-serif;
    padding-bottom: 3rem;
  }
  .pf-hero { text-align: center; padding: 2.5rem 1rem 1.5rem; }
  .pf-title { font-size: 2rem; font-weight: 900; color: #1b4332; }
  .pf-sub { color: #52796f; font-weight: 600; }
  .pf-card {
    background: #fff; border-radius: 24px; padding: 1.75rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 16px 48px rgba(58,125,68,0.10);
    height: 100%; margin-bottom: 1.25rem;
  }
  .pf-card::before {
    content: ''; display: block; height: 4px; margin: -1.75rem -1.75rem 1.25rem;
    border-radius: 24px 24px 0 0;
    background: linear-gradient(90deg,#3a7d44,#52b788,#95d5b2);
  }
  .pf-sec-title {
    font-size: 0.8rem; font-weight: 800; letter-spacing: 0.08em;
    text-transform: uppercase; color: #52796f; margin-bottom: 1rem;
  }
  .pf-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #d8f3dc; font-size: 0.95rem; }
  .pf-row:last-child { border-bottom: none; }
  .pf-key { color: #52796f; font-weight: 600; }
  .pf-val { color: #1b4332; font-weight: 800; text-align: right; max-width: 60%; }
  .pf-chip { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; margin: 2px 4px 2px 0; }
  .pf-chip-yes { background: #d8f3dc; color: #1b4332; }
  .pf-chip-no { background: #f1f5f9; color: #64748b; }
  .pf-list-item {
    background: #f8fff9; border: 1px solid #d8f3dc; border-radius: 14px;
    padding: 12px 14px; margin-bottom: 10px;
  }
  .pf-back {
    display: inline-flex; align-items: center; gap: 6px;
    color: #3a7d44; font-weight: 800; text-decoration: none; margin-bottom: 1rem;
  }
  .pf-back:hover { color: #1b4332; }
`;

export default function ProfilePage() {
  const user = getStoredUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!document.getElementById("pf-styles")) {
      const tag = document.createElement("style");
      tag.id = "pf-styles";
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (!user?.farmerId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/farmer/profile/${user.farmerId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load profile");
        setProfileData(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.farmerId]);

  if (!user?.farmerId) {
    return (
      <div className="pf-page">
        <NavScrollExample />
        <Container className="py-5 text-center">
          <Alert variant="warning" style={{ borderRadius: 16, fontWeight: 600 }}>
            Please log in to view your profile.
          </Alert>
          <Link to="/log" className="btn btn-success mt-3" style={{ fontWeight: 800, borderRadius: 12 }}>
            Go to Login
          </Link>
        </Container>
        <Footer />
      </div>
    );
  }

  const profile = profileData?.profile || user;
  const activity = profileData?.activity || {};
  const mp = profileData?.marketplace || { farmerListings: [], merchantListings: [] };

  return (
    <div className="pf-page">
      <NavScrollExample />
      <div className="pf-hero">
        <h1 className="pf-title">My Profile</h1>
        <p className="pf-sub">Account details and marketplace activity</p>
      </div>

      <Container>
        <Link to="/" className="pf-back">← Back to Home</Link>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-3 text-muted fw-semibold">Loading your profile...</p>
          </div>
        )}

        {error && <Alert variant="danger" style={{ borderRadius: 14 }}>{error}</Alert>}

        {!loading && !error && (
          <Row>
            <Col lg={6}>
              <div className="pf-card">
                <div className="pf-sec-title">👤 Personal Information</div>
                {[
                  ["Full Name", profile.userName],
                  ["Farmer ID", profile.farmerId],
                  ["Email", profile.email],
                  ["Mobile", profile.mobile],
                  ["State", profile.state],
                  ["Land Size", profile.landSize ? `${profile.landSize} acres` : "—"],
                  ["Crop Type", profile.cropType || "—"],
                  ["Registered", activity.registeredAt ? new Date(activity.registeredAt).toLocaleString() : "—"],
                ].map(([k, v]) => (
                  <div className="pf-row" key={k}>
                    <span className="pf-key">{k}</span>
                    <span className="pf-val">{v || "—"}</span>
                  </div>
                ))}
              </div>
            </Col>

            <Col lg={6}>
              <div className="pf-card">
                <div className="pf-sec-title">📊 Activity Summary</div>
                <div className="pf-row">
                  <span className="pf-key">Marketplace as Farmer</span>
                  <span>
                    <span className={`pf-chip ${activity.hasMarketplaceFarmer ? "pf-chip-yes" : "pf-chip-no"}`}>
                      {activity.hasMarketplaceFarmer ? `Yes (${activity.marketplaceFarmerCount})` : "Not added"}
                    </span>
                  </span>
                </div>
                <div className="pf-row">
                  <span className="pf-key">Marketplace as Merchant</span>
                  <span>
                    <span className={`pf-chip ${activity.hasMarketplaceMerchant ? "pf-chip-yes" : "pf-chip-no"}`}>
                      {activity.hasMarketplaceMerchant ? `Yes (${activity.marketplaceMerchantCount})` : "Not added"}
                    </span>
                  </span>
                </div>
                <div className="pf-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <span className="pf-key mb-2">Modules used</span>
                  <div>
                    {(activity.modulesUsed || ["Account"]).map((m) => (
                      <Badge key={m} bg="success" className="me-1 mb-1" style={{ fontWeight: 700 }}>
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <Link to="/market" className="btn btn-outline-success" style={{ borderRadius: 12, fontWeight: 800 }}>
                    🏪 Open Marketplace
                  </Link>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="pf-card">
                <div className="pf-sec-title">🌿 Farmer Listings</div>
                {mp.farmerListings?.length ? (
                  mp.farmerListings.map((item, i) => (
                    <div className="pf-list-item" key={i}>
                      <strong>{item.product}</strong> — ₹{item.price}/kg<br />
                      <small className="text-muted">Qty: {item.quantity} · ID: {item.farmerId}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">You have not posted as a farmer in the marketplace yet.</p>
                )}
              </div>
            </Col>

            <Col md={6}>
              <div className="pf-card">
                <div className="pf-sec-title">🏪 Merchant Listings</div>
                {mp.merchantListings?.length ? (
                  mp.merchantListings.map((item, i) => (
                    <div className="pf-list-item" key={i}>
                      <strong>{item.product}</strong> — ₹{item.price}/kg<br />
                      <small className="text-muted">Qty: {item.quantity} · ID: {item.merchantId}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">You have not posted as a merchant in the marketplace yet.</p>
                )}
              </div>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
}
