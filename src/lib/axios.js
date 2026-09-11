import axios from "axios";
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
instance.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);
var axios_default = instance;
export {
  axios_default as default
};
