import { request } from "./client.js";

export const authApi = {
  register: async ({ name, email, password }) => {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async ({ email, password }) => {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return request("/api/auth/logout", {
      method: "POST",
    });
  },

  getMe: async () => {
    return request("/api/auth/me", {
      method: "GET",
    });
  },
};
