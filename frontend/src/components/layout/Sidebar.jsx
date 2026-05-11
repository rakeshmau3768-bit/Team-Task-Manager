import { NavLink } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

export default function Sidebar({ isOpen, onClose }) {
  const { data: projects } = useProjects();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-56 h-screen bg-white border-r border-gray-200 flex flex-col shrink-0 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <span className="text-base font-bold text-blue-600">TaskManager</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/projects", label: "All Projects" },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              )}>
              {label}
            </NavLink>
          ))}
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">My Projects</p>
            {projects?.map(p => (
              <NavLink key={p._id} to={`/projects/${p._id}`}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm transition-colors truncate",
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                )}>
                {p.name}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
          <span className="text-sm text-gray-700 truncate">{user?.name}</span>
        </div>
      </aside>
    </>
  );
}