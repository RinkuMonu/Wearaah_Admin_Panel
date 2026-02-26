import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "https://vmm9pgj8-5000.inc1.devtunnels.ms/api",
});

// 🔐 Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚨 Handle force logout
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const message = error?.response?.data?.message;

    if (status === 401 || code === "FORCE_LOGOUT") {
      Swal.fire({
        title: "Session Expired",
        text: message || "Please login again",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      });
    }

    return Promise.reject(error);
  },
);

export default api;
