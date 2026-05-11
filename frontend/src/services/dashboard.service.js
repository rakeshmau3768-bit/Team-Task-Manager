import axiosInstance from "./axios.instance";

export const getStats = () => axiosInstance.get("/dashboard/stats");
export const getOverdueTasks = () => axiosInstance.get("/dashboard/overdue");
export const getRecentActivity = () => axiosInstance.get("/dashboard/activity");
