import { useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import KanbanBoard from "../components/task/KanbanBoard";
import TaskFilters from "../components/task/TaskFilters";
import TaskForm from "../components/task/TaskForm";
import MemberList from "../components/project/MemberList";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useProject } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import useAuthStore from "../store/authStore";
import { isProjectAdmin } from "../utils/roleUtils";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { data: project, isLoading: projectLoading } = useProject(id);
  const [filters, setFilters] = useState({});
  const [tab, setTab] = useState("board");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { data: tasks, isLoading: tasksLoading } = useTasks(id, filters);

  const isAdmin = user?.role === "admin" || isProjectAdmin(project, user?._id);

  if (projectLoading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{project?.name}</h1>
          {project?.description && (
            <p className="text-sm text-gray-500 mt-0.5">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant={tab === "board" ? "primary" : "ghost"} size="sm"
            onClick={() => setTab("board")}>Board</Button>
          <Button variant={tab === "members" ? "primary" : "ghost"} size="sm"
            onClick={() => setTab("members")}>
            Members ({project?.members?.length})
          </Button>
        </div>
      </div>

      {tab === "board" && (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <TaskFilters filters={filters} onChange={setFilters} members={project?.members || []} />
            <Button size="sm" onClick={() => setShowTaskForm(true)}>+ Add Task</Button>
          </div>
          {tasksLoading
            ? <div className="flex justify-center py-10"><Spinner size="lg" /></div>
            : <KanbanBoard tasks={tasks || []} project={project} />
          }
        </>
      )}

      {tab === "members" && (
        <MemberList
          members={project?.members || []}
          isAdmin={isAdmin}
        />
      )}

      {showTaskForm && (
        <TaskForm
          projectId={id}
          members={project?.members || []}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </PageWrapper>
  );
}