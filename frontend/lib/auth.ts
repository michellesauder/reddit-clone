// Token management
export const auth = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  isAuthenticated: (): boolean => {
    return auth.getToken() !== null;
  },
};
