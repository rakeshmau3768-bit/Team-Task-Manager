import { formatDate } from "../../utils/formatDate";
import Avatar from "../ui/Avatar";
import dayjs from "dayjs";

export default function OverdueList({ tasks = [] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Overdue Tasks</h2>
      {tasks.length === 0 && (
        <p className="text-sm text-gray-400">No overdue tasks 🎉</p>
      )}
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
              <p className="text-xs text-gray-500">{task.project?.name}</p>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              {task.assignedTo && <Avatar name={task.assignedTo.name} size="sm" />}
              <span className="text-xs text-red-600 font-medium whitespace-nowrap">
                {Math.abs(dayjs().diff(dayjs(task.dueDate), "day"))}d overdue
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}