import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../services/task.service";
import PageWrapper from "../components/layout/PageWrapper";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { formatDate } from "../utils/formatDate";
import { useDeleteTask, useUpdateTaskStatus } from "../hooks/useTasks";
import useAuthStore from "../store/authStore";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await getTaskById(taskId);
      return res.data.data;
    },
    enabled: !!taskId,
  });

  if (isLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <PageWrapper>
      <div className="max-w-2xl bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-800">{task?.title}</h1>
        <p className="text-sm text-gray-600">{task?.description || "No description"}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge label={task?.status} />
          <Badge label={task?.priority} />
        </div>
        {task?.assignedTo && (
          <div className="flex items-center gap-2">
            <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size="sm" />
            <span className="text-sm text-gray-600">{task.assignedTo.name}</span>
          </div>
        )}
        {task?.dueDate && (
          <p className="text-sm text-gray-500">Due: {formatDate(task.dueDate)}</p>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Change Status</label>
          <select defaultValue={task?.status}
            onChange={e => updateStatus({ id: taskId, status: e.target.value })}
            className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>Back</Button>
          {task?.createdBy?._id === user?._id && (
            <Button variant="danger" size="sm"
              onClick={() => deleteTask(taskId, { onSuccess: () => navigate(-1) })}>
              Delete Task
            </Button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}