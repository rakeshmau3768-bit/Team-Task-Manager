import { NavLink } from "react-router-dom";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

export default function AdminSidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/users", label: "Manage Users", icon: "👥" },
    { to: "/admin/projects", label: "All Projects", icon: "📁" },
  ];

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
          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}>
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
          <div>
            <p className="text-sm text-gray-700 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </aside>
    </>
  );
}