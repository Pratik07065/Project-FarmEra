import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavScrollExample from "../navbar";
import Footer from "../common/footer";
import { API_BASE, adminHeaders } from "../common/api";
import { clearStoredAdmin, getStoredAdmin } from "../common/authStorage";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  .ad-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0faf0 0%, #e8f5e2 50%, #f5faf0 100%);
    font-family: 'Nunito', sans-serif;
    padding-bottom: 3rem;
  }
  .ad-layout { display: flex; gap: 1.25rem; flex-wrap: wrap; }
  .ad-sidebar {
    flex: 0 0 240px; background: #fff; border-radius: 20px;
    padding: 1.25rem; box-shadow: 0 8px 32px rgba(58,125,68,0.12);
    border: 1px solid rgba(58,125,68,0.1); height: fit-content;
  }
  .ad-sidebar-title { font-weight: 900; color: #1b4332; margin-bottom: 1rem; font-size: 1.1rem; }
  .ad-nav-btn {
    width: 100%; text-align: left; border: none; background: transparent;
    padding: 10px 12px; border-radius: 12px; font-weight: 700; color: #52796f;
    margin-bottom: 6px; transition: all 0.2s;
  }
  .ad-nav-btn:hover, .ad-nav-btn.active {
    background: #e8f5e2; color: #1b4332;
  }
  .ad-nav-btn.logout { color: #b91c1c; margin-top: 1rem; }
  .ad-nav-btn.logout:hover { background: #fef2f2; }
  .ad-main {
    flex: 1; min-width: 280px; background: #fff; border-radius: 20px;
    padding: 1.5rem; box-shadow: 0 8px 32px rgba(58,125,68,0.12);
  }
  .ad-main h2 { font-weight: 900; color: #1b4332; font-size: 1.4rem; margin-bottom: 1rem; }
  .ad-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #52796f; }
  .ad-del-btn {
    border: none; background: #fee2e2; color: #b91c1c; font-weight: 800;
    padding: 4px 10px; border-radius: 8px; font-size: 0.8rem;
  }
  .ad-del-btn:hover { background: #fecaca; }
  .ad-badge-admin {
    display: inline-block; background: linear-gradient(135deg,#1b4332,#3a7d44);
    color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800;
  }
`;

const SECTIONS = [
  { id: "users", label: "👥 Manage Users", icon: "users" },
  { id: "farmers", label: "🌿 Marketplace Farmers", icon: "farmers" },
  { id: "merchants", label: "🏪 Marketplace Merchants", icon: "merchants" },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const admin = getStoredAdmin();
  const [section, setSection] = useState("users");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [marketFarmers, setMarketFarmers] = useState([]);
  const [marketMerchants, setMarketMerchants] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [showAddMerchant, setShowAddMerchant] = useState(false);
  const [newUser, setNewUser] = useState({
    farmerId: "", userName: "", email: "", mobile: "", state: "", password: "",
  });
  const [newFarmer, setNewFarmer] = useState({
    Name: "", farmerId: "", contact: "", emailId: "", product: "", quantity: "", price: "",
  });
  const [newMerchant, setNewMerchant] = useState({
    Name: "", merchantId: "", contact: "", emailId: "", product: "", quantity: "", price: "",
  });

  useEffect(() => {
    if (!document.getElementById("ad-styles")) {
      const tag = document.createElement("style");
      tag.id = "ad-styles";
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (!admin?.adminId) {
      navigate("/log", { replace: true });
      return;
    }
    loadSection(section);
  }, [admin?.adminId, section, navigate]);

  const loadSection = async (sec) => {
    setLoading(true);
    setError("");
    try {
      const headers = adminHeaders();
      if (sec === "users") {
        const res = await fetch(`${API_BASE}/admin/users`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load users");
        setUsers(data.users || []);
      } else if (sec === "farmers") {
        const res = await fetch(`${API_BASE}/admin/market/farmers`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load farmers");
        setMarketFarmers(data.items || []);
      } else if (sec === "merchants") {
        const res = await fetch(`${API_BASE}/admin/market/merchants`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load merchants");
        setMarketMerchants(data.items || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearStoredAdmin();
    navigate("/");
  };

  const deleteUser = async (farmerId) => {
    if (!window.confirm(`Remove user "${farmerId}"?`)) return;
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/admin/users/${farmerId}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage(`User ${farmerId} removed.`);
      loadSection("users");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMarketFarmer = async (item) => {
    if (!window.confirm(`Remove farmer listing for "${item.Name}"?`)) return;
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/admin/market/farmer`, {
        method: "DELETE",
        headers: adminHeaders(),
        body: JSON.stringify({
          farmerId: item.farmerId,
          Name: item.Name,
          emailId: item.emailId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage("Farmer marketplace entry removed.");
      loadSection("farmers");
    } catch (err) {
      setError(err.message);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed");
      setMessage("User added successfully.");
      setShowAddUser(false);
      loadSection("users");
    } catch (err) {
      setError(err.message);
    }
  };

  const addMarketFarmer = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/admin/market/farmer`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(newFarmer),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed");
      setMessage("Farmer listing added.");
      setShowAddFarmer(false);
      loadSection("farmers");
    } catch (err) {
      setError(err.message);
    }
  };

  const addMarketMerchant = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/admin/market/merchant`, {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify(newMerchant),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed");
      setMessage("Merchant listing added.");
      setShowAddMerchant(false);
      loadSection("merchants");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMarketMerchant = async (item) => {
    if (!window.confirm(`Remove merchant listing for "${item.Name}"?`)) return;
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/admin/market/merchant`, {
        method: "DELETE",
        headers: adminHeaders(),
        body: JSON.stringify({
          merchantId: item.merchantId,
          Name: item.Name,
          emailId: item.emailId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMessage("Merchant marketplace entry removed.");
      loadSection("merchants");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!admin?.adminId) return null;

  return (
    <div className="ad-page">
      <NavScrollExample />
      <Container className="py-4">
        <div className="mb-3">
          <span className="ad-badge-admin">Admin Panel</span>
          <span className="ms-2 text-muted fw-semibold">Logged in as {admin.adminId}</span>
        </div>

        <div className="ad-layout">
          <aside className="ad-sidebar">
            <div className="ad-sidebar-title">Controls</div>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`ad-nav-btn ${section === s.id ? "active" : ""}`}
                onClick={() => setSection(s.id)}
              >
                {s.label}
              </button>
            ))}
            <button type="button" className="ad-nav-btn logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </aside>

          <main className="ad-main">
            {message && <Alert variant="success" style={{ borderRadius: 12 }}>{message}</Alert>}
            {error && <Alert variant="danger" style={{ borderRadius: 12 }}>{error}</Alert>}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
              </div>
            ) : (
              <>
                {section === "users" && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="mb-0">Registered Users</h2>
                      <Button
                        variant="success"
                        style={{ fontWeight: 800, borderRadius: 10 }}
                        onClick={() => setShowAddUser(!showAddUser)}
                      >
                        {showAddUser ? "Cancel" : "+ Add User"}
                      </Button>
                    </div>
                    {showAddUser && (
                      <form onSubmit={addUser} className="mb-4 p-3" style={{ background: "#f8fff9", borderRadius: 14 }}>
                        <Row className="g-2">
                          {Object.keys(newUser).map((key) => (
                            <Col md={4} key={key}>
                              <input
                                className="form-control"
                                placeholder={key}
                                value={newUser[key]}
                                onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                                required={key !== "state" || true}
                              />
                            </Col>
                          ))}
                        </Row>
                        <Button type="submit" variant="success" className="mt-2" style={{ fontWeight: 800 }}>
                          Save User
                        </Button>
                      </form>
                    )}
                    <Table responsive hover className="ad-table">
                      <thead>
                        <tr>
                          <th>Farmer ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>State</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.farmerId}>
                            <td>{u.farmerId}</td>
                            <td>{u.userName}</td>
                            <td>{u.email}</td>
                            <td>{u.state}</td>
                            <td>
                              <button type="button" className="ad-del-btn" onClick={() => deleteUser(u.farmerId)}>
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {!users.length && <p className="text-muted">No users found.</p>}
                  </>
                )}

                {section === "farmers" && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="mb-0">Marketplace — Farmer Posts</h2>
                      <Button
                        variant="success"
                        style={{ fontWeight: 800, borderRadius: 10 }}
                        onClick={() => setShowAddFarmer(!showAddFarmer)}
                      >
                        {showAddFarmer ? "Cancel" : "+ Add Farmer Post"}
                      </Button>
                    </div>
                    {showAddFarmer && (
                      <form onSubmit={addMarketFarmer} className="mb-4 p-3" style={{ background: "#f8fff9", borderRadius: 14 }}>
                        <Row className="g-2">
                          {Object.keys(newFarmer).map((key) => (
                            <Col md={4} key={key}>
                              <input
                                className="form-control"
                                placeholder={key}
                                value={newFarmer[key]}
                                onChange={(e) => setNewFarmer({ ...newFarmer, [key]: e.target.value })}
                              />
                            </Col>
                          ))}
                        </Row>
                        <Button type="submit" variant="success" className="mt-2" style={{ fontWeight: 800 }}>
                          Save Listing
                        </Button>
                      </form>
                    )}
                    <Table responsive hover className="ad-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Farmer ID</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketFarmers.map((item, i) => (
                          <tr key={`${item.farmerId}-${i}`}>
                            <td>{item.Name}</td>
                            <td>{item.farmerId}</td>
                            <td>{item.product}</td>
                            <td>₹{item.price}</td>
                            <td>
                              <button type="button" className="ad-del-btn" onClick={() => deleteMarketFarmer(item)}>
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {!marketFarmers.length && <p className="text-muted">No farmer listings.</p>}
                  </>
                )}

                {section === "merchants" && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h2 className="mb-0">Marketplace — Merchant Posts</h2>
                      <Button
                        variant="success"
                        style={{ fontWeight: 800, borderRadius: 10 }}
                        onClick={() => setShowAddMerchant(!showAddMerchant)}
                      >
                        {showAddMerchant ? "Cancel" : "+ Add Merchant Post"}
                      </Button>
                    </div>
                    {showAddMerchant && (
                      <form onSubmit={addMarketMerchant} className="mb-4 p-3" style={{ background: "#f8fff9", borderRadius: 14 }}>
                        <Row className="g-2">
                          {Object.keys(newMerchant).map((key) => (
                            <Col md={4} key={key}>
                              <input
                                className="form-control"
                                placeholder={key}
                                value={newMerchant[key]}
                                onChange={(e) => setNewMerchant({ ...newMerchant, [key]: e.target.value })}
                              />
                            </Col>
                          ))}
                        </Row>
                        <Button type="submit" variant="success" className="mt-2" style={{ fontWeight: 800 }}>
                          Save Listing
                        </Button>
                      </form>
                    )}
                    <Table responsive hover className="ad-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Merchant ID</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketMerchants.map((item, i) => (
                          <tr key={`${item.merchantId}-${i}`}>
                            <td>{item.Name}</td>
                            <td>{item.merchantId}</td>
                            <td>{item.product}</td>
                            <td>₹{item.price}</td>
                            <td>
                              <button type="button" className="ad-del-btn" onClick={() => deleteMarketMerchant(item)}>
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {!marketMerchants.length && <p className="text-muted">No merchant listings.</p>}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
