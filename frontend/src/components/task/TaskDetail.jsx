import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { formatDate } from "../../utils/formatDate";
import { useUpdateTaskStatus, useDeleteTask } from "../../hooks/useTasks";
import useAuthStore from "../../store/authStore";
import { canDeleteTask } from "../../utils/roleUtils";

export default function TaskDetail({ task, project, onClose }) {
  const { user } = useAuthStore();
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();

  const showDelete = canDeleteTask(task, user, project);

  return (
    <Modal title={task.title} onClose={onClose}>
      <div className="space-y-3">
        <p className="text-sm text-gray-600">{task.description || "No description"}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge label={task.status} />
          <Badge label={task.priority} />
        </div>
        {task.assignedTo && (
          <div className="flex items-center gap-2">
            <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size="sm" />
            <span className="text-sm text-gray-600">{task.assignedTo.name}</span>
          </div>
        )}
        {task.dueDate && (
          <p className="text-sm text-gray-500">Due: {formatDate(task.dueDate)}</p>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Change Status</label>
          <select defaultValue={task.status}
            onChange={e => updateStatus({ id: task._id, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        {showDelete && (
          <Button variant="danger" size="sm"
            onClick={() => deleteTask(task._id, { onSuccess: onClose })}>
            Delete Task
          </Button>
        )}
      </div>
    </Modal>
  );
}