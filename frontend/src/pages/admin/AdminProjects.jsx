import { useState } from "react";
import { useAllProjectsAdmin, useCreateAdminProject } from "../../hooks/useAdmin";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import ProjectForm from "../../components/project/ProjectForm";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

export default function AdminProjects() {
  const { data: projects, isLoading } = useAllProjectsAdmin();
  const createAdminProjectMutation = useCreateAdminProject();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">All Projects</h1>
        <Button onClick={() => setShowForm(true)}>+ New Project</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Owner</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Members</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects?.map(project => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{project.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {project.description || "No description"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={project.owner?.name} size="sm" />
                        <span className="text-sm text-gray-600">{project.owner?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-1">
                        {project.members?.slice(0, 3).map(m => (
                          <Avatar key={m.user._id} name={m.user.name}
                            src={m.user.avatar} size="sm"
                            className="ring-2 ring-white" />
                        ))}
                        {project.members?.length > 3 && (
                          <span className="text-xs text-gray-500 ml-2 self-center">
                            +{project.members.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/projects/${project._id}`}>
                        <Button size="sm" variant="secondary">Manage</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects?.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">No projects yet</p>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {projects?.map(project => (
              <div key={project._id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{project.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {project.description || "No description"}
                    </p>
                  </div>
                  <Link to={`/admin/projects/${project._id}`}>
                    <Button size="sm" variant="secondary">Manage</Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Avatar name={project.owner?.name} size="sm" />
                    <span>{project.owner?.name}</span>
                  </div>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Members:</span>
                  <div className="flex -space-x-1">
                    {project.members?.slice(0, 3).map(m => (
                      <Avatar key={m.user._id} name={m.user.name}
                        src={m.user.avatar} size="sm"
                        className="ring-2 ring-white" />
                    ))}
                    {project.members?.length > 3 && (
                      <span className="text-xs text-gray-500 ml-2 self-center">
                        +{project.members.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects?.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">No projects yet</p>
            )}
          </div>
        </>
      )}

      {showForm && <ProjectForm onClose={() => setShowForm(false)} createMutation={createAdminProjectMutation} />}
    </div>
  );
}