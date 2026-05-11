import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800 mb-1 truncate">{project.name}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description || "No description"}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          {project.members?.slice(0, 4).map(m => (
            <Avatar key={m.user._id} name={m.user.name} src={m.user.avatar} size="sm" className="ring-2 ring-white" />
          ))}
        </div>
        <span className="text-xs text-gray-400">{project.members?.length} members</span>
      </div>
    </Link>
  );
}