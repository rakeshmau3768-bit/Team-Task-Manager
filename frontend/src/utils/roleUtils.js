export const isAdmin = (user) => user?.role === "admin";

export const isProjectAdmin = (project, userId) => {
  return project?.members?.find(
    m => m.user._id === userId
  )?.role === "Admin";
};

export const canDeleteTask = (task, user, project) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (isProjectAdmin(project, user._id)) return true;
  if (task.createdBy?._id === user._id) return true;
  return false;
};

export const canUpdateTask = (task, user, project) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (isProjectAdmin(project, user._id)) return true;
  if (task.createdBy?._id === user._id) return true;
  return false;
};