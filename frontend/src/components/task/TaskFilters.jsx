export default function TaskFilters({ filters, onChange, members = [] }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select value={filters.status || ""}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={filters.priority || ""}
        onChange={e => onChange({ ...filters, priority: e.target.value })}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select value={filters.assignedTo || ""}
        onChange={e => onChange({ ...filters, assignedTo: e.target.value })}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <option value="">All Members</option>
        {members.map(m => (
          <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
        ))}
      </select>
    </div>
  );
}