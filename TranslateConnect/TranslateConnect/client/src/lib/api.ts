import { useAuth } from "./auth";

export function useApiRequest() {
  const { token } = useAuth();

  return async (
    method: string,
    url: string,
    data?: unknown
  ): Promise<Response> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response;
  };
}
