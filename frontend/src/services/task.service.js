import axiosInstance from "./axios.instance";

export const getTasksByProject = (projectId, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return axiosInstance.get(`/tasks/project/${projectId}?${params}`);
};
export const getTaskById = (id) => axiosInstance.get(`/tasks/${id}`);
export const createTask = (projectId, data) => axiosInstance.post(`/tasks/project/${projectId}`, data);
export const updateTask = (id, data) => axiosInstance.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) => axiosInstance.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => axiosInstance.delete(`/tasks/${id}`);
