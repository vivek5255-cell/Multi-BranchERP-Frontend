// CRA-safe service (no Vite). Uses REACT_APP_API_URL if set.
const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const ROOT = `${BASE}/api/invoices`;

async function jsonOrThrow(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} :: ${text || res.statusText}`);
  }
  return res.json();
}

export async function getAllInvoices() {
  const res = await fetch(ROOT, { credentials: "include" });
  return jsonOrThrow(res);
}

export async function createInvoice(payload) {
  // backend expects @RequestParam — send as form fields
  const body = new URLSearchParams();
  body.set("poId", payload.poId);
  if (payload.invoiceDate) body.set("invoiceDate", payload.invoiceDate);
  if (payload.status) body.set("status", payload.status);
  if (payload.subtotal != null) body.set("subtotal", payload.subtotal);
  if (payload.tax != null) body.set("tax", payload.tax);
  if (payload.discount != null) body.set("discount", payload.discount);
  body.set("totalAmount", payload.totalAmount ?? 0);
  if (payload.notes) body.set("notes", payload.notes);

  const res = await fetch(ROOT, { method: "POST", body, credentials: "include" });
  return jsonOrThrow(res);
}

export async function updateInvoiceStatus(invoiceId, newStatus) {
  const res = await fetch(`${ROOT}/${invoiceId}/status?status=${encodeURIComponent(newStatus)}`, {
    method: "PATCH",
    credentials: "include",
  });
  return jsonOrThrow(res);
}

export async function deleteInvoice(invoiceId) {
  const res = await fetch(`${ROOT}/${invoiceId}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} :: ${text || res.statusText}`);
  }
  return true;
}
