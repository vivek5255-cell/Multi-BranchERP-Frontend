// src/services/vendorService.js
import api from "./api";

// ✅ Get all vendors
export async function getVendors() {
  const res = await api.get("/vendors");
  return res.data;
}

// ✅ Add new vendor
export async function addVendor(vendorData) {
  const res = await api.post("/vendors", vendorData);
  return res.data;
}

// ✅ Update vendor by ID
export async function updateVendor(id, vendorData) {
  const res = await api.put(`/vendors/${id}`, vendorData);
  return res.data;
}

// ✅ Delete vendor
export async function deleteVendor(id) {
  const res = await api.delete(`/vendors/${id}`);
  return res.data;
}
