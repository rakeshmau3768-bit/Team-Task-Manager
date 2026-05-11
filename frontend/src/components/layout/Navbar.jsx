import { useLocation } from "react-router-dom";
import Avatar from "../ui/Avatar";
import DropdownMenu from "../ui/DropdownMenu";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/profile": "Profile",
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Users",
  "/admin/projects": "Projects",
  "/admin/profile": "Profile",
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const title = pageTitles[pathname] || "Team Task Manager";

  const handleProfileClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      </div>
      <DropdownMenu
        trigger={<Avatar name={user?.name} src={user?.avatar} size="sm" />}
        items={[
          { label: "Profile", onClick: handleProfileClick },
          { label: "Logout", onClick: logout },
        ]}
      />
    </header>
  );
}