const Task = require("../models/Task.model");
const Project = require("../models/Project.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");

const getStats = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id });
  const projectIds = projects.map(p => p._id);

  // Check if user is admin in any project or system admin
  const isSystemAdmin = req.user.role === "admin";
  const isProjectAdmin = projects.some(p =>
    p.members.find(m => m.user.toString() === req.user._id.toString())?.role === "Admin"
  );

  const taskFilter = { project: { $in: projectIds } };
  if (!isSystemAdmin && !isProjectAdmin) {
    taskFilter.assignedTo = req.user._id;
  }

  const totalTasks = await Task.countDocuments(taskFilter);
  const completedTasks = await Task.countDocuments({ ...taskFilter, status: "done" });
  const overdueTasks = await Task.countDocuments({
    ...taskFilter,
    dueDate: { $lt: new Date() },
    status: { $ne: "done" }
  });

  res.status(200).json(new ApiResponse(200, {
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    overdueTasks,
  }, "Stats fetched"));
});

const getOverdueTasks = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id });
  const projectIds = projects.map(p => p._id);

  const isSystemAdmin = req.user.role === "admin";
  const isProjectAdmin = projects.some(p =>
    p.members.find(m => m.user.toString() === req.user._id.toString())?.role === "Admin"
  );

  const taskFilter = {
    project: { $in: projectIds },
    dueDate: { $lt: new Date() },
    status: { $ne: "done" }
  };
  if (!isSystemAdmin && !isProjectAdmin) {
    taskFilter.assignedTo = req.user._id;
  }

  const tasks = await Task.find(taskFilter)
    .populate("assignedTo", "name email avatar")
    .populate("project", "name");

  res.status(200).json(new ApiResponse(200, tasks, "Overdue tasks fetched"));
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id });
  const projectIds = projects.map(p => p._id);

  const isSystemAdmin = req.user.role === "admin";
  const isProjectAdmin = projects.some(p =>
    p.members.find(m => m.user.toString() === req.user._id.toString())?.role === "Admin"
  );

  const taskFilter = { project: { $in: projectIds } };
  if (!isSystemAdmin && !isProjectAdmin) {
    taskFilter.assignedTo = req.user._id;
  }

  const tasks = await Task.find(taskFilter)
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar")
    .populate("project", "name");

  res.status(200).json(new ApiResponse(200, tasks, "Recent activity fetched"));
});

module.exports = { getStats, getOverdueTasks, getRecentActivity };
