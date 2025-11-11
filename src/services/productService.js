// // src/services/productService.js
// import http from "./http";

// // GET /api/products -> [{id, productName or name, ...}]
// export async function getProducts() {
//   const { data } = await http.get("/products");
//   return Array.isArray(data) ? data : [];
// }

// export async function addProduct(payload) {
//   const { data } = await http.post("/products", payload);
//   return data;
// }
// export async function updateProduct(id, payload) {
//   const { data } = await http.put(`/products/${id}`, payload);
//   return data;
// }
// export async function deleteProduct(id) {
//   const { data } = await http.delete(`/products/${id}`);
//   return data;
// }


import axios from "axios";

export async function getProducts() {
  const { data } = await axios.get("/api/products");
  return data;
}

// (optional) keep your other helpers as-is:
export async function addProduct(body) {
  const { data } = await axios.post("/api/products", body);
  return data;
}
export async function updateProduct(id, body) {
  const { data } = await axios.put(`/api/products/${id}`, body);
  return data;
}
export async function deleteProduct(id) {
  const { data } = await axios.delete(`/api/products/${id}`);
  return data;
}
