// // src/services/purchaseService.js
// import api from "./api";

// /* ========= PURCHASE ORDERS ========= */

// // GET all POs
// export async function getAllPurchaseOrders() {
//   const res = await api.get("/purchase-orders");
//   return res.data;
// }

// // CREATE PO
// export async function addPurchaseOrder(data) {
//   const res = await api.post("/purchase-orders", data);
//   return res.data;
// }

// // UPDATE PO STATUS (Approved / Cancelled / Received)
// export async function updatePurchaseOrderStatus(id, status) {
//   const res = await api.put(`/purchase-orders/${id}/status?status=${status}`);
//   return res.data;
// }

// /* ========= GRN (if you already added) ========= */

// export async function getAllGRNs() {
//   const res = await api.get("/grns");
//   return res.data;
// }

// export async function addGRN(data) {
//   const res = await api.post("/grns", data);
//   return res.data;
// }

// /* ========= INVOICE (if you already added) ========= */

// export async function getAllInvoices() {
//   const res = await api.get("/invoices");
//   return res.data;
// }

// export async function addInvoice(data) {
//   const res = await api.post("/invoices", data);
//   return res.data;
// }


/// src/services/purchaseService.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

async function toJsonOrThrow(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}

export async function getAllPurchaseOrders() {
  const res = await fetch(`${API_BASE}/purchase-orders`, { method: "GET" });
  return toJsonOrThrow(res);
}

/**
 * Create PO
 * payload example:
 * {
 *   vendorId: 1,
 *   branchId: 1,
 *   orderDate: "2025-11-02",
 *   items: [{ productId: 10, qty: 5, price: 120 }],
 *   status: "PENDING"
 * }
 */
export async function addPurchaseOrder(payload) {
  const res = await fetch(`${API_BASE}/purchase-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return toJsonOrThrow(res);
}

/** Update PO status: PENDING | APPROVED | CANCELLED | RECEIVED (your backend values) */
export async function updatePurchaseOrderStatus(id, status) {
  const res = await fetch(
    `${API_BASE}/purchase-orders/${id}/status?status=${encodeURIComponent(status)}`,
    { method: "PUT" }
  );
  return toJsonOrThrow(res);
}
