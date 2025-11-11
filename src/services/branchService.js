// // src/services/branchService.js
// import http from "./http";

// // GET /api/branches -> [{id, branchName, ...}]
// export async function getBranches() {
//   const { data } = await http.get("/branches");
//   return Array.isArray(data) ? data : [];
// }

// // (kept your other exports if you already use them elsewhere)
// export async function addBranch(payload) {
//   const { data } = await http.post("/branches", payload);
//   return data;
// }
// export async function updateBranch(id, payload) {
//   const { data } = await http.put(`/branches/${id}`, payload);
//   return data;
// }
// export async function deleteBranch(id) {
//   const { data } = await http.delete(`/branches/${id}`);
//   return data;
// }

import axios from "axios";

export async function getBranches() {
  const { data } = await axios.get("/api/branches");
  return data;
}

// (optional) keep your other helpers as-is:
export async function addBranch(body) {
  const { data } = await axios.post("/api/branches", body);
  return data;
}
export async function updateBranch(id, body) {
  const { data } = await axios.put(`/api/branches/${id}`, body);
  return data;
}
export async function deleteBranch(id) {
  const { data } = await axios.delete(`/api/branches/${id}`);
  return data;
}
