const Project = require("../models/Project.model");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

// System level — sirf admin
const requireRole = (...roles) => asyncHandler(async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, "Access denied");
  }
  next();
});

// Project level — project ka member hai ya nahi
const isProjectMember = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId;
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (req.user.role === "admin") return next();

  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!member) throw new ApiError(403, "You are not a member of this project");
  next();
});

// Project level — Admin role check
const checkProjectRole = (...roles) => asyncHandler(async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId;
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (req.user.role === "admin") return next();

  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  if (!member || !roles.includes(member.role)) {
    throw new ApiError(403, "Project admin access required");
  }
  next();
});

module.exports = { requireRole, isProjectMember, checkProjectRole };