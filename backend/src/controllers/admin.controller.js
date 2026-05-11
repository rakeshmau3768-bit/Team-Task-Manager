const User = require("../models/User.model");
const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

// Saare users ki list
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "name email role avatar createdAt");
  res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

// User ka role change karo
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["admin", "user"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("name email role");
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, user, "Role updated"));
});

// Saare projects (admin ke liye)
const getAllProjectsAdmin = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");
  res.status(200).json(new ApiResponse(200, projects, "Projects fetched"));
});

// Kisi bhi project mein member add karo (email se)
const addMemberToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  console.log("Adding member with email:", email); // debug

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) throw new ApiError(404, `No user found with email: ${email}`);

  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  const alreadyMember = project.members.find(
    m => m.user.toString() === user._id.toString()
  );
  if (alreadyMember) throw new ApiError(400, "User already a member");

  project.members.push({ user: user._id, role: role || "Member" });
  await project.save();

  const updated = await Project.findById(req.params.id)
    .populate("members.user", "name email avatar");

  res.status(200).json(new ApiResponse(200, updated, "Member added"));
});

// Project se member remove karo
const removeMemberFromProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.owner.toString() === req.params.memberId) {
    throw new ApiError(400, "Cannot remove project owner");
  }

  project.members = project.members.filter(
    m => m.user.toString() !== req.params.memberId
  );
  await project.save();
  res.status(200).json(new ApiResponse(200, {}, "Member removed"));
});

// Admin task create kare aur kisi ko bhi assign kare
const createTaskAdmin = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, priority, dueDate, status } = req.body;

  const project = await Project.findById(req.params.projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate: dueDate || undefined,
    assignedTo: assignedTo && assignedTo !== "" ? assignedTo : undefined,
    project: req.params.projectId,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, task, "Task created"));
});

// Admin saari tasks dekhe
const getAllTasksAdmin = asyncHandler(async (req, res) => {
  const filter = { project: req.params.projectId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched"));
});

// Admin stats
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProjects = await Project.countDocuments();
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: "done" });
  const overdueTasks = await Task.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $ne: "done" },
  });

  res.status(200).json(new ApiResponse(200, {
    totalUsers,
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
  }, "Stats fetched"));
});

module.exports = {
  getAllUsers,
  updateUserRole,
  getAllProjectsAdmin,
  addMemberToProject,
  removeMemberFromProject,
  createTaskAdmin,
  getAllTasksAdmin,
  getAdminStats,
};