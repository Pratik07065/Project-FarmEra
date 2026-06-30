export const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

export function adminHeaders() {
  try {
    const raw = sessionStorage.getItem("farmeraAdmin");
    if (!raw) return {};
    const admin = JSON.parse(raw);
    return {
      "X-Admin-Id": admin.adminId || "",
      "X-Admin-Password": admin.password || "",
      "Content-Type": "application/json",
    };
  } catch {
    return {};
  }
}
