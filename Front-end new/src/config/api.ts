// API Configuration
export const API_CONFIG = {
  // Backend API base URL - served via nginx proxy
  BASE_URL: '/api',
  
  ENDPOINTS: {
    // Price endpoints
    PRICES: '/prices',
    V1_PRICES: '/v1/prices',
    
    // API Manager endpoints
    PLANS: '/plans',
    PURCHASE: '/me/purchase',
    MY_KEYS: '/me/keys',
    ADD_REQUESTS: '/me/keys',
    SELF_USAGE: '/self/usage',
  },
  
  // Auto-refresh interval (30 seconds)
  REFRESH_INTERVAL: 30000,
};

// Helper function to build full API URL
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to make authenticated API calls
export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return fetch(buildApiUrl(endpoint), {
    ...options,
    headers,
  });
}
