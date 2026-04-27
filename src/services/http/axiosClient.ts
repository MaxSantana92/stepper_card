import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../config';

export interface AppHttpError {
  message: string;
  status?: number;
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { Accept: 'application/json' },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const appError: AppHttpError = axios.isAxiosError(error)
      ? { message: error.message, status: error.response?.status }
      : { message: 'Unknown error' };
    return Promise.reject(appError);
  },
);
