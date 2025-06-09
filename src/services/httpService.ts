import axios from "axios";
import { API_CONFIG } from "@/constants/config";

const instance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

instance.interceptors.request.use((config) => {
  const authUser = localStorage.getItem("authUser");
  if (authUser) {
    const token = JSON.parse(authUser).token;
    if (token) {
      config.headers["X-API-Key"] = token;
    }
  }
  return config;
});

export const get = (url: string, config = {}) => instance.get(url, config);

export const post = (url: string, data: any, config = {}) =>
  instance.post(url, data, config);

export const put = (url: string, data: any, config = {}) =>
  instance.put(url, data, config);

export const del = (url: string, config = {}) => instance.delete(url, config);
