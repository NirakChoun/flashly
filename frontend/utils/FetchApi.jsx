const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://flashly-api-adwh.onrender.com";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("auth_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // For FormData, don't set Content-Type (let browser set it with boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  return response;
};

// Helper for JSON responses
export const apiRequestJson = async (endpoint, options = {}) => {
  const response = await apiRequest(endpoint, options);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage =
        errorJson.error || errorJson.message || `HTTP ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
