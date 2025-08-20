const API_URL = "http://localhost:5000/api";

// --- AUTH ---
export const signup = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

// --- ASSETS ---
export const getAllAssets = async () => {
  const res = await fetch(`${API_URL}/assets`);
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
};