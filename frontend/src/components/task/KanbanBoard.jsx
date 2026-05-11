import { useState } from "react";
import TaskCard from "./TaskCard";
import TaskDetail from "./TaskDetail";
import { TASK_STATUS } from "../../utils/constants";

const columns = [
  { key: TASK_STATUS.TODO, label: "Todo", color: "bg-gray-100" },
  { key: TASK_STATUS.IN_PROGRESS, label: "In Progress", color: "bg-blue-50" },
  { key: TASK_STATUS.DONE, label: "Done", color: "bg-green-50" },
];

export default function KanbanBoard({ tasks = [], project }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.key} className={`${col.color} rounded-xl p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">{col.label}</h3>
              <span className="text-xs bg-white text-gray-500 rounded-full px-2 py-0.5 border border-gray-200">
                {tasks.filter(t => t.status === col.key).length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.filter(t => t.status === col.key).map(task => (
                <TaskCard key={task._id} task={task} onClick={() => setSelected(task)} />
              ))}
              {tasks.filter(t => t.status === col.key).length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <TaskDetail
          task={selected}
          project={project}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}