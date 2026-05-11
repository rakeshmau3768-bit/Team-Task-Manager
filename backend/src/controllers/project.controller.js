const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "Admin" }],
  });
  res.status(201).json(new ApiResponse(201, project, "Project created"));
});

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ "members.user": req.user._id })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");
  res.status(200).json(new ApiResponse(200, projects, "Projects fetched"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");
  if (!project) throw new ApiError(404, "Project not found");
  res.status(200).json(new ApiResponse(200, project, "Project fetched"));
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) throw new ApiError(404, "Project not found");
  res.status(200).json(new ApiResponse(200, project, "Project updated"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Only owner can delete");
  await Task.deleteMany({ project: req.params.id });
  await project.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Project deleted"));
});

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };