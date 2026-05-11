import axiosInstance from "./axios.instance";

export const getAdminStats = () =>
  axiosInstance.get("/admin/stats");

export const getAllUsers = () =>
  axiosInstance.get("/admin/users");

export const updateUserRole = (id, role) =>
  axiosInstance.put(`/admin/users/${id}/role`, { role });

export const getAllProjectsAdmin = () =>
  axiosInstance.get("/admin/projects");

export const addMemberToProject = (projectId, data) =>
  axiosInstance.post(`/admin/projects/${projectId}/members`, data);

export const removeMemberFromProject = (projectId, memberId) =>
  axiosInstance.delete(`/admin/projects/${projectId}/members/${memberId}`);

export const getAdminProjectTasks = (projectId, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return axiosInstance.get(`/admin/projects/${projectId}/tasks?${params}`);
};

export const createAdminTask = (projectId, data) =>
  axiosInstance.post(`/admin/projects/${projectId}/tasks`, data);