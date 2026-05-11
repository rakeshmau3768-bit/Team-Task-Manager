import axiosInstance from "./axios.instance";

export const getProjects = () => axiosInstance.get("/projects");
export const getProjectById = (id) => axiosInstance.get(`/projects/${id}`);
export const createProject = (data) => axiosInstance.post("/projects", data);
export const updateProject = (id, data) => axiosInstance.put(`/projects/${id}`, data);
export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);

export const getMembers = (id) => axiosInstance.get(`/projects/${id}/members`);
export const inviteMember = (id, data) => axiosInstance.post(`/projects/${id}/members`, data);
export const removeMember = (id, memberId) => axiosInstance.delete(`/projects/${id}/members/${memberId}`);
export const updateMemberRole = (id, memberId, role) => axiosInstance.put(`/projects/${id}/members/${memberId}`, { role });