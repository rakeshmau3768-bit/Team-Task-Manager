import axiosInstance from "./axios.instance";

export const login = (data) => axiosInstance.post("/auth/login", data);
export const signup = (data) => axiosInstance.post("/auth/signup", data);
export const logout = () => axiosInstance.post("/auth/logout");
export const getMe = () => axiosInstance.get("/auth/me");
export const refreshToken = () => axiosInstance.post("/auth/refresh-token");