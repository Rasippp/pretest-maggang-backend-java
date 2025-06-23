// src/services/api.js
import axios from "axios";
import { APP_BASE_URL } from "../configs/constants";

// Buat instance Axios
const instance = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request – Tambah Bearer Token jika tersedia
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token && user?.type) {
      config.headers["Authorization"] = `${user.type} ${user.token}`; // hasilnya: Bearer <token>
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response – Refresh token otomatis jika expired (401)
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (
      originalConfig &&
      err.response &&
      err.response.status === 401 &&
      !originalConfig._retry &&
      originalConfig.url !== "/auth/signin"
    ) {
      originalConfig._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.refreshToken) throw new Error("No refresh token");

        const response = await instance.post("/auth/refreshToken", {
          refreshToken: user.refreshToken,
        });

        // Update token baru ke localStorage
        localStorage.setItem("user", JSON.stringify(response.data));

        // Ulangi request asli dengan token baru
        return instance(originalConfig);
      } catch (refreshError) {
        localStorage.removeItem("user");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
