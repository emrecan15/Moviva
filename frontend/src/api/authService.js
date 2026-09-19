import api from "./axiosInstance";

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/user/register", data);
export const logout = () => api.post("/auth/logout");
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const resetPasswordConfirm = (data) =>
  api.post("/auth/reset-password/confirm", data);
export const changePassword = (data) => api.post("/user/change-password", data);
export const getAuthStatus = () => api.get("/auth/status");
