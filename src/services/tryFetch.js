import api from "./api";

// path should start with a slash but NOT include the baseURL.
// Example: "/reports/summary"  (helper will also try "/api/reports/summary")
export async function tryGET(path, config = {}) {
  // Try with /api prefix first
  const pathWithApi = path.startsWith("/api") ? path : "/api" + path;
  try {
    const { data } = await api.get(pathWithApi, config);
    return data;
  } catch (err) {
    if (err?.response?.status === 404 && !path.startsWith("/api")) {
      // Retry without /api
      const { data } = await api.get(path, config);
      return data;
    }
    // rethrow other errors
    throw err;
  }
}
