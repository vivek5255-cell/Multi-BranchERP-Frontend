// import axios from "axios";

// export const getSummary = async () => (await axios.get("/api/reports/summary")).data;

// export const getPurchasesByDate = async (from, to) => {
//   const params = {};
//   if (from) params.from = from;
//   if (to) params.to = to;
//   const { data } = await axios.get("/api/reports/purchases-by-date", { params });
//   return Array.isArray(data) ? data : [];
// };

// export const getInvoicesByDate = async (from, to) => {
//   const params = {};
//   if (from) params.from = from;
//   if (to) params.to = to;
//   const { data } = await axios.get("/api/reports/invoices-by-date", { params });
//   return Array.isArray(data) ? data : [];
// };

// export const getTransfersByStatus = async () =>
//   (await axios.get("/api/reports/transfers-by-status")).data;

// export const getTopVendors = async () =>
//   (await axios.get("/api/reports/top-vendors")).data;

// src/services/reportService.js
// import api from "./api"; // your existing axios instance

// export async function getSummary() {
//   const { data } = await api.get("/reports/summary");
//   return data;
// }

// export async function getPurchasesByDate(from, to) {
//   const { data } = await api.get("/reports/purchases", { params: { from, to } });
//   return data;
// }

// export async function getInvoicesByDate(from, to) {
//   const { data } = await api.get("/reports/invoices", { params: { from, to } });
//   return data;
// }

// export async function getTransferStatusCounts() {
//   const { data } = await api.get("/reports/transfers/status");
//   return data;
// }

// export async function getTopVendors() {
//   const { data } = await api.get("/reports/top-vendors");
//   return data;
// }












import api from "./api";

/** Dashboard / Reports data */
export async function getSummary() {
  const { data } = await api.get("/reports/summary");
  return data;
}

export async function getPurchasesByDate(from, to) {
  // backend route is /api/reports/purchases-by-date (with from,to as query params)
  const { data } = await api.get("/reports/purchases-by-date", {
    params: { from, to },
  });
  return data;
}

export async function getInvoicesByDate(from, to) {
  // backend route is /api/reports/invoices-by-date
  const { data } = await api.get("/reports/invoices-by-date", {
    params: { from, to },
  });
  return data;
}

export async function getTransferStatusCounts() {
  // backend route is /api/reports/transfers-by-status
  const { data } = await api.get("/reports/transfers-by-status");
  return data;
}

export async function getTopVendors() {
  // backend route is /api/reports/top-vendors
  const { data } = await api.get("/reports/top-vendors");
  return data;
}




