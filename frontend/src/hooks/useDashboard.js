import { useQuery } from "@tanstack/react-query";
import { getStats, getOverdueTasks, getRecentActivity } from "../services/dashboard.service";

export const useStats = () =>
  useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await getStats();
      return res.data.data;
    },
  });

export const useOverdueTasks = () =>
  useQuery({
    queryKey: ["overdue"],
    queryFn: async () => {
      const res = await getOverdueTasks();
      return res.data.data;
    },
  });

export const useRecentActivity = () =>
  useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await getRecentActivity();
      return res.data.data;
    },
  });