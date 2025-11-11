// import axios from "axios";

// export async function getAllTransfers() {
//   const { data } = await axios.get("/api/stock-transfers");
//   return data;
// }

// export async function createTransfer(payload) {
//   const { data } = await axios.post("/api/stock-transfers", payload);
//   return data;
// }

// // If your backend expects query param instead, change body to: null and add `params: { status }`.
// export async function updateTransferStatus(id, status) {
//   const { data } = await axios.patch(`/api/stock-transfers/${id}/status`, { status });
//   return data;
// }


import axios from "axios";

export async function getAllTransfers() {
  const { data } = await axios.get("/api/stock-transfers");
  return Array.isArray(data) ? data : [];
}
export async function createTransfer(payload) {
  const { data } = await axios.post("/api/stock-transfers", payload);
  return data;
}
export async function updateTransferStatus(id, status) {
  const { data } = await axios.patch(`/api/stock-transfers/${id}/status`, { status });
  return data;
}
