// src/services/grnService.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

async function toJsonOrThrow(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}

export async function getAllGRNs() {
  const res = await fetch(`${API_BASE}/grns`, { method: "GET" });
  return toJsonOrThrow(res);
}

// payload: { poId: number, receivedDate: "YYYY-MM-DD", status: "RECEIVED"|"PARTIAL"|"CANCELLED" }
export async function createGRN(payload) {
  const res = await fetch(`${API_BASE}/grns`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return toJsonOrThrow(res);
}

export async function updateGRNStatus(id, status) {
  const res = await fetch(`${API_BASE}/grns/${id}/status?status=${encodeURIComponent(status)}`, {
    method: "PUT",
  });
  return toJsonOrThrow(res);
}
