import api from "./api";

const authService = {
  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  refresh: async (refreshToken) => {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    return data;
  },
};

export default authService;