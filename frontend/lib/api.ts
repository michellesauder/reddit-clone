const API_BASE_URL = "http://localhost:3001";

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Generic fetch wrapper with auth
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    // Ensure headers is a plain object for type-safety
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: async (email: string, username: string, password: string) => {
    return apiRequest<{ user: any; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

export const postsApi = {
  getAll: async () => {
    return apiRequest<any[]>("/posts");
  },

  getOne: async (id: string) => {
    return apiRequest<any>(`/posts/${id}`);
  },

  create: async (title: string, content?: string, link?: string) => {
    return apiRequest<any>("/posts", {
      method: "POST",
      body: JSON.stringify({ title, content, link }),
    });
  },
};

// Comments API
export const commentsApi = {
  getByPost: async (postId: string) => {
    return apiRequest<any[]>(`/posts/${postId}/comments`);
  },

  create: async (postId: string, content: string, parentId?: string) => {
    return apiRequest<any>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content, parentId }),
    });
  },
};
