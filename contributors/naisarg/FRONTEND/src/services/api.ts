/**
 * Centralized API Client for SAATHI BIS Standards Assistant
 * Connects to live backend at https://orignal-saathi-ixw7.onrender.com
 */

const API_BASE_URL: string =
  (import.meta.env?.VITE_API_BASE_URL as string) ||
  'https://orignal-saathi-ixw7.onrender.com';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiClientError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    // Trim trailing slashes
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Handle full URLs gracefully
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // Construct URL with query parameters
    let urlString = `${this.baseUrl}${cleanEndpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        urlString += (urlString.includes('?') ? '&' : '?') + queryString;
      }
    }
    return urlString;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, headers, ...customConfig } = options;
    const url = this.buildUrl(endpoint, params);

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || localStorage.getItem('auth_token')
        : null;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((headers as Record<string, string>) || {}),
    };

    // If body is FormData, do not set Content-Type header so the browser sets boundary
    if (customConfig.body instanceof FormData) {
      delete defaultHeaders['Content-Type'];
    }

    try {
      const response = await fetch(url, {
        headers: defaultHeaders,
        ...customConfig,
      });

      let responseData: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const errorMessage =
          (typeof responseData === 'object' && responseData?.message) ||
          (typeof responseData === 'string' && responseData) ||
          `Request to ${endpoint} failed with status ${response.status}`;
        throw new ApiClientError(response.status, errorMessage, responseData);
      }

      return {
        data: responseData as T,
        status: response.status,
        ok: response.ok,
      };
    } catch (error: any) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError(0, error?.message || 'Network error / server unreachable', null);
    }
  }

  public async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
