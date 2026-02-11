// API Configuration
// Change this to your backend URL
export const API_CONFIG = {
  BASE_URL: 'http://31.59.105.156/api',
  ENDPOINTS: {
    PRICES: '/prices',
    CURRENCIES: '/currencies',
    GOLD: '/gold',
    COINS: '/coins',
    CRYPTO: '/crypto',
  },
  // Auto-refresh interval in milliseconds (30 seconds)
  REFRESH_INTERVAL: 30000,
};

// API Helper functions
export const apiClient = {
  get: async (endpoint: string, headers?: HeadersInit) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  post: async (endpoint: string, data?: any, headers?: HeadersInit) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
};
