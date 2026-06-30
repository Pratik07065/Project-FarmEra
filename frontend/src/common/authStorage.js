const USER_KEY = "farmeraUser";
const ADMIN_KEY = "farmeraAdmin";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("farmera-auth-change"));
}

export function clearStoredUser() {
  setStoredUser(null);
}

export function getStoredAdmin() {
  try {
    const raw = sessionStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin) {
  if (admin) sessionStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  else sessionStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event("farmera-auth-change"));
}

export function clearStoredAdmin() {
  setStoredAdmin(null);
}

export async function loginWithFarmerOrAdmin(credentials) {
  const { farmerId, password } = credentials;
  const base = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

  const farmerRes = await fetch(`${base}/farmer/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ farmerId, password }),
  });
  const farmerData = await farmerRes.json();

  if (farmerRes.ok) {
    return { type: "farmer", data: farmerData };
  }

  const adminRes = await fetch(`${base}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminId: farmerId, password }),
  });
  const adminData = await adminRes.json();

  if (adminRes.ok) {
    return {
      type: "admin",
      data: { ...adminData, password },
    };
  }

  throw new Error(farmerData.error || adminData.error || "Login failed");
}
