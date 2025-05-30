import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": process.env.NEXT_PUBLIC_API_TOKEN,
  },
});

instance.interceptors.request.use((config) => {
  try {
    const cookie = Cookies.get("user");
    const userInfo = cookie ? JSON.parse(cookie) : null;
    if (userInfo?.token) {
      config.headers["Authorization"] = `Bearer ${userInfo.token}`;
    }
  } catch (err) {
    console.warn("Invalid userInfo cookie format", err);
  }
  return config;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  instance.get<T>(url, config).then(responseBody);

const post = <T>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
): Promise<T> => instance.post<T>(url, body, config).then(responseBody);

const put = <T>(
  url: string,
  body: any,
  config?: AxiosRequestConfig
): Promise<T> => instance.put<T>(url, body, config).then(responseBody);

const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  instance.delete<T>(url, config).then(responseBody);

export { get, post, put, del };
