import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import { formatDate, isOverdue } from "../../utils/formatDate";

export default function TaskCard({ task, onClick }) {
  return (
    <div onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-shadow space-y-2">
      <p className="text-sm font-medium text-gray-800">{task.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge label={task.priority} />
        {task.dueDate && (
          <span className={`text-xs ${isOverdue(task.dueDate) && task.status !== "done" ? "text-red-500 font-medium" : "text-gray-400"}`}>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
      {task.assignedTo && (
        <div className="flex items-center gap-1">
          <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size="sm" />
          <span className="text-xs text-gray-500 truncate">{task.assignedTo.name}</span>
        </div>
      )}
    </div>
  );
}