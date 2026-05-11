import { useState } from "react";
import { useAllUsers, useUpdateUserRole } from "../../hooks/useAdmin";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function AdminUsers() {
  const { data: users, isLoading } = useAllUsers();
  const { mutate: updateRole, isPending } = useUpdateUserRole();
  const [confirmId, setConfirmId] = useState(null);

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateRole({ id: userId, role: newRole });
    setConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Manage Users</h1>
        <span className="text-sm text-gray-500">{users?.length} total users</span>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} src={user.avatar} size="sm" />
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {confirmId === user._id ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="danger"
                            loading={isPending}
                            onClick={() => handleRoleChange(user._id, user.role)}>
                            Confirm
                          </Button>
                          <Button size="sm" variant="ghost"
                            onClick={() => setConfirmId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="secondary"
                          onClick={() => setConfirmId(user._id)}>
                          Make {user.role === "admin" ? "User" : "Admin"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {users?.map(user => (
              <div key={user._id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-2">
                  {confirmId === user._id ? (
                    <>
                      <Button size="sm" variant="danger"
                        loading={isPending}
                        onClick={() => handleRoleChange(user._id, user.role)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost"
                        onClick={() => setConfirmId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="secondary"
                      onClick={() => setConfirmId(user._id)}>
                      Make {user.role === "admin" ? "User" : "Admin"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}