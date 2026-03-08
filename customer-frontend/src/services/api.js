import axios from "axios";

export const SERVER_URL = "http://localhost:3000";
export const API_BASE_URL = `${SERVER_URL}/api/customer/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessJWT");
  if (token) {
    // Some backends expect the raw token value in the Authorization header
    // (no "Bearer " prefix). Keep it raw to match the backend examples.
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default api;
