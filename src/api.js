import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // ✅ Hapus withCredentials jika pakai Bearer token
  // withCredentials: true,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Log lebih detail untuk debugging
    if (error.response) {
      console.error("API ERROR:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("NO RESPONSE (network/CORS/timeout):", error.message);
    } else {
      console.error("REQUEST ERROR:", error.message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login"; // opsional: redirect
    }

    return Promise.reject(error);
  }
);

export default api;