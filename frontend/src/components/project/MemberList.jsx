import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function MemberList({ members = [], isAdmin = false, onRemove, onRoleChange }) {
  return (
    <div className="space-y-3">
      {members.length === 0 && <p className="text-sm text-gray-400">No members yet</p>}
      {members.map((m) => (
        <div key={m.user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar name={m.user.name} src={m.user.avatar} size="md" />
            <div>
              <p className="text-sm font-medium text-gray-800">{m.user.name}</p>
              <p className="text-xs text-gray-500">{m.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge label={m.role} />
            {isAdmin && onRoleChange && (
              <Button variant="secondary" size="sm"
                onClick={() => onRoleChange(m.user._id, m.role === "Admin" ? "Member" : "Admin")}>
                Change Role
              </Button>
            )}
            {isAdmin && onRemove && (
              <Button variant="danger" size="sm" onClick={() => onRemove(m.user._id)}>
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}