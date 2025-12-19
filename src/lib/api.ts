import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from "sonner";
import { Address } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface FailedQueueItem {
  resolve: (value: string | PromiseLike<string> | null) => void;
  reject: (reason?: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for adding the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh and global error display
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error status is 401 and it's not a refresh token request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token, redirect to login or handle as unauthenticated
        // Display a toast message for unauthenticated access
        toast.error("You are not authenticated. Please log in.");
        // For now, just reject the request
        return Promise.reject(error);
      }

      try {
        // Call your refresh token API endpoint
        // This is a mock implementation. Replace with actual API call.
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken: newAccessToken } = response.data;

        localStorage.setItem('accessToken', newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        // Clear tokens and redirect to login on refresh failure
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Display a toast message for refresh failure
        toast.error("Session expired. Please log in again.");
        // Optionally, redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors globally
    const skipGlobalErrorHandler = (error.config as any)?.skipGlobalErrorHandler;
    
    if (!skipGlobalErrorHandler) {
      const errorMessage = (error.response?.data as any)?.message || error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export const placeOrder = async (orderData: { shippingAddress: Address }) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

export const getMySales = async () => {
  const response = await api.get('/orders/my-sales');
  return response.data;
};

export const getUserOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
};

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export default api;
