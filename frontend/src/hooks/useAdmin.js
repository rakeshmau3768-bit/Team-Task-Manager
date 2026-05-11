import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  getAllProjectsAdmin,
  addMemberToProject,
  removeMemberFromProject,
  getAdminProjectTasks,
  createAdminTask,
} from "../services/admin.service";
import { createProject } from "../services/project.service";

export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await getAdminStats();
      return res.data.data;
    },
  });

export const useAllUsers = () =>
  useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await getAllUsers();
      return res.data.data;
    },
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });
};

export const useAllProjectsAdmin = () =>
  useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const res = await getAllProjectsAdmin();
      return res.data.data;
    },
  });

export const useCreateAdminProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (response) => {
      const newProject = response.data.data;
      // Update the admin projects list cache immediately with the new project
      queryClient.setQueryData(["admin-projects"], (oldData) => [...(oldData || []), newProject]);
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      // Invalidate regular projects query as well
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddMemberToProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => addMemberToProject(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
};

export const useRemoveMemberFromProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, memberId }) =>
      removeMemberFromProject(projectId, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-projects"] }),
  });
};

export const useAdminProjectTasks = (projectId, filters) =>
  useQuery({
    queryKey: ["admin-tasks", projectId, filters],
    queryFn: async () => {
      const res = await getAdminProjectTasks(projectId, filters);
      return res.data.data;
    },
    enabled: !!projectId,
  });

export const useCreateAdminTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => createAdminTask(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-tasks"] }),
  });
};