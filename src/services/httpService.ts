import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": process.env.NEXT_PUBLIC_API_TOKEN,
  },
});

const responseBody = (response: AxiosResponse) => response.data;

const get = (url: string, config?: AxiosRequestConfig): Promise<any> =>
  instance.get(url, config).then(responseBody);

const post = (
  url: string,
  body: any,
  config?: AxiosRequestConfig
): Promise<any> => instance.post(url, body, config).then(responseBody);

const put = (
  url: string,
  body: any,
  config?: AxiosRequestConfig
): Promise<any> => instance.put(url, body, config).then(responseBody);

const del = (url: string, config?: AxiosRequestConfig): Promise<any> =>
  instance.delete(url, config).then(responseBody);

export { get, post, put, del };
