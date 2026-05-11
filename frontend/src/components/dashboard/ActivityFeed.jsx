import Avatar from "../ui/Avatar";
import { formatRelative } from "../../utils/formatDate";

export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.length === 0 && (
          <p className="text-sm text-gray-400">No recent activity</p>
        )}
        {activities.map(task => (
          <div key={task._id} className="flex items-center gap-3">
            <Avatar name={task.createdBy?.name} src={task.createdBy?.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">
                <span className="font-medium">{task.createdBy?.name}</span>
                {" updated "}
                <span className="font-medium">{task.title}</span>
              </p>
              <p className="text-xs text-gray-400">
                {task.project?.name} · {formatRelative(task.updatedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}