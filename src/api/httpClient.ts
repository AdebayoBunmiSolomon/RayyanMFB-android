// /**
//  * Custom HTTP client that bypasses SSL certificate validation
//  */

// interface HttpClientConfig {
//   url: string;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE';
//   headers?: Record<string, string>;
//   body?: any;
//   timeout?: number;
// }

// class HttpClient {
//   private baseURL: string;

//   constructor(baseURL: string) {
//     this.baseURL = baseURL;
//   }

//   async request(config: HttpClientConfig) {
//     const { url, method, headers = {}, body, timeout = 15000 } = config;

//     // Use fetch with more permissive settings
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeout);

//     try {
//       const response = await fetch(`${this.baseURL}${url}`, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'X-MOBILE-API-KEY':
//             'ey765443409gffrgfhj8sdfrzabjmko23570b099876jhkjoip',
//           ...headers,
//         },
//         body: body ? JSON.stringify(body) : undefined,
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return { data };
//     } catch (error) {
//       clearTimeout(timeoutId);

//       if (error instanceof Error && error.name === 'AbortError') {
//         throw new Error('Request timeout');
//       }

//       throw error;
//     }
//   }

//   async post(url: string, data: any, headers?: Record<string, string>) {
//     return this.request({
//       url,
//       method: 'POST',
//       headers,
//       body: data,
//     });
//   }

//   async get(url: string, headers?: Record<string, string>) {
//     return this.request({
//       url,
//       method: 'GET',
//       headers,
//     });
//   }
// }

// // Create instance with Rayyan Bank API base URL
// export const httpClient = new HttpClient('https://ibank.rayyanbank.com.ng/api');

// export default httpClient;

/**
 * Lightweight fetch-based HTTP client for the Rayyan Bank API.
 *
 * Note: this does NOT bypass SSL/TLS certificate validation. `fetch` in
 * React Native has no client-side option to disable cert checking from JS —
 * if SSL errors aren't occurring, that's being handled at the native/server
 * level, not here.
 */

const API_KEY = 'ey765443409gffrgfhj8sdfrzabjmko23570b099876jhkjoip';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HttpClientConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface HttpResponse<T = any> {
  data: T;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T = any>(config: HttpClientConfig): Promise<HttpResponse<T>> {
    const { url, method, headers = {}, body, timeout = 15000 } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-MOBILE-API-KEY': API_KEY,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  async get<T = any>(url: string, headers?: Record<string, string>) {
    return this.request<T>({ url, method: 'GET', headers });
  }

  async post<T = any>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ) {
    return this.request<T>({ url, method: 'POST', body: data, headers });
  }

  async put<T = any>(url: string, data: any, headers?: Record<string, string>) {
    return this.request<T>({ url, method: 'PUT', body: data, headers });
  }

  async delete<T = any>(url: string, headers?: Record<string, string>) {
    return this.request<T>({ url, method: 'DELETE', headers });
  }
}

// Create instance with Rayyan Bank API base URL
export const httpClient = new HttpClient('https://ibank.rayyanbank.com.ng/api');

export default httpClient;
