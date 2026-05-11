import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasksByProject,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../services/task.service";

export const useTasks = (projectId, filters) =>
  useQuery({
    queryKey: ["tasks", projectId, filters],
    queryFn: async () => {
      const res = await getTasksByProject(projectId, filters);
      return res.data.data;
    },
    enabled: !!projectId,
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }) => createTask(projectId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
};