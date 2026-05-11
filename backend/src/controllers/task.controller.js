const Task = require("../models/Task.model");
const Project = require("../models/Project.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate: dueDate || undefined,
    assignedTo: assignedTo && assignedTo !== "" ? assignedTo : undefined,
    project: req.params.projectId,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, task, "Task created"));
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const filter = { project: req.params.projectId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar")
    .populate("project", "name");

  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json(new ApiResponse(200, task, "Task fetched"));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  // Check: system admin, project Admin, ya task creator hi update kar sakta hai
  const project = await Project.findById(task.project);
  const memberInProject = project?.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  const isProjectAdmin = memberInProject?.role === "Admin";
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isSystemAdmin = req.user.role === "admin";

  if (!isSystemAdmin && !isProjectAdmin && !isCreator) {
    throw new ApiError(403, "Not allowed to update this task");
  }

  const updates = { ...req.body };
  if (updates.assignedTo === "") updates.assignedTo = undefined;
  if (updates.dueDate === "") updates.dueDate = undefined;

  const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.status(200).json(new ApiResponse(200, updated, "Task updated"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  // Assignee, creator, project Admin, ya system admin status change kar sakta hai
  const project = await Project.findById(task.project);
  const memberInProject = project?.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isProjectAdmin = memberInProject?.role === "Admin";
  const isSystemAdmin = req.user.role === "admin";

  if (!isSystemAdmin && !isProjectAdmin && !isAssignee && !isCreator) {
    throw new ApiError(403, "Not allowed to change task status");
  }

  task.status = status;
  await task.save();
  res.status(200).json(new ApiResponse(200, task, "Status updated"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  const project = await Project.findById(task.project);
  const memberInProject = project?.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  const isProjectAdmin = memberInProject?.role === "Admin";
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isSystemAdmin = req.user.role === "admin";

  if (!isSystemAdmin && !isProjectAdmin && !isCreator) {
    throw new ApiError(403, "Not allowed to delete this task");
  }

  await task.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Task deleted"));
});

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};