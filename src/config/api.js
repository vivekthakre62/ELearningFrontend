const rawBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
export const WS_BASE_URL =
  (process.env.REACT_APP_WS_BASE_URL || API_BASE_URL).replace(/\/+$/, "");

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
