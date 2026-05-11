import { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import ProjectCard from "../components/project/ProjectCard";
import ProjectForm from "../components/project/ProjectForm";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: projects, isLoading } = useProjects();

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Projects</h1>
        <Button onClick={() => setShowForm(true)}>+ New Project</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map(p => <ProjectCard key={p._id} project={p} />)}
          {projects?.length === 0 && (
            <p className="text-gray-400 text-sm col-span-3">No projects yet. Create one!</p>
          )}
        </div>
      )}
      {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
    </PageWrapper>
  );
}