import PageWrapper from "../components/layout/PageWrapper";
import StatsCard from "../components/dashboard/StatsCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import OverdueList from "../components/dashboard/OverdueList";
import { useStats, useOverdueTasks, useRecentActivity } from "../hooks/useDashboard";
import Spinner from "../components/ui/Spinner";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";

export default function DashboardPage() {
  const { data: stats, isLoading } = useStats();
  const { data: overdue } = useOverdueTasks();
  const { data: activity } = useRecentActivity();
  const { data: projects } = useProjects();

  return (
    <PageWrapper>
      <h1 className="text-xl font-bold text-gray-800 mb-6">My Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard label="My Projects" value={stats?.totalProjects} color="blue" />
            <StatsCard label="My Tasks" value={stats?.totalTasks} color="amber" />
            <StatsCard label="Completed" value={stats?.completedTasks} color="green" />
            <StatsCard label="Overdue" value={stats?.overdueTasks} color="red" />
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {projects?.map(p => (
                <Link key={p._id} to={`/projects/${p._id}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <p className="font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.members?.length} members</p>
                </Link>
              ))}
              {projects?.length === 0 && (
                <p className="text-sm text-gray-400">
                  You haven't been added to any project yet.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActivityFeed activities={activity || []} />
            <OverdueList tasks={overdue || []} />
          </div>
        </>
      )}
    </PageWrapper>
  );
}