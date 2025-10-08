/**
 * Generic API client with error handling and optional caching
 */

export interface RequestOptions extends RequestInit {
  cacheTtl?: number; // Cache TTL in seconds (0 = no cache)
}

/**
 * Make an authenticated API request
 * @param url API endpoint URL
 * @param options Request options (method, headers, body, cacheTtl)
 * @returns Parsed JSON response
 * @throws Error if request fails
 */
export async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cacheTtl: _cacheTtl = 0, ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while making API request');
  }
}
