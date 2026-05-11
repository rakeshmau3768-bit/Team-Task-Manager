import { useAdminStats } from "../../hooks/useAdmin";
import { useAllProjectsAdmin } from "../../hooks/useAdmin";
import StatsCard from "../../components/dashboard/StatsCard";
import Spinner from "../../components/ui/Spinner";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: projects } = useAllProjectsAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard label="Total Users" value={stats?.totalUsers} color="blue" />
          <StatsCard label="Total Projects" value={stats?.totalProjects} color="amber" />
          <StatsCard label="Total Tasks" value={stats?.totalTasks} color="blue" />
          <StatsCard label="Completed" value={stats?.completedTasks} color="green" />
          <StatsCard label="Overdue" value={stats?.overdueTasks} color="red" />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">All Projects</h2>
          <Link to="/admin/projects"
            className="text-sm text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {projects?.slice(0, 5).map(project => (
            <Link key={project._id} to={`/admin/projects/${project._id}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-800">{project.name}</p>
                <p className="text-xs text-gray-500">
                  {project.members?.length} members · Created by {project.owner?.name}
                </p>
              </div>
              <span className="text-xs text-gray-400">{formatDate(project.createdAt)}</span>
            </Link>
          ))}
          {projects?.length === 0 && (
            <p className="text-sm text-gray-400">No projects yet</p>
          )}
        </div>
      </div>
    </div>
  );
}