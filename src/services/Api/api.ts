import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { getApiBaseUrl } from './runtimeApi';

class Api {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  async GET<T extends { data: any }>(url: string, config?: AxiosRequestConfig): Promise<T['data']> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async POST<T extends { data: any }>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T['data']> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async PATCH<T extends { data: any }>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T['data']> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  async PUT<T extends { data: any }>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T['data']> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async DELETE<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }
}

const HOST = getApiBaseUrl();

export const api = new Api(HOST);
