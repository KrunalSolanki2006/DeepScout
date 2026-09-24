import { request } from "./client.js";

export const investigationsApi = {
  investigate: async ({ question, sourceType = "web" }) => {
    return request("/api/investigations", {
      method: "POST",
      body: JSON.stringify({ question, sourceType }),
    });
  },

  getAll: async () => {
    return request("/api/investigations", {
      method: "GET",
    });
  },

  getById: async (id) => {
    return request(`/api/investigations/${id}`, {
      method: "GET",
    });
  },

  delete: async (id) => {
    return request(`/api/investigations/${id}`, {
      method: "DELETE",
    });
  },
};
