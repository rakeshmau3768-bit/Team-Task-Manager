const Project = require("../models/Project.model");
const User = require("../models/User.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const inviteMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  const alreadyMember = project.members.find(m => m.user.toString() === user._id.toString());
  if (alreadyMember) throw new ApiError(400, "User already a member");
  project.members.push({ user: user._id, role: role || "Member" });
  await project.save();
  res.status(200).json(new ApiResponse(200, project, "Member invited"));
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  if (project.owner.toString() === req.params.memberId) throw new ApiError(400, "Cannot remove owner");
  project.members = project.members.filter(m => m.user.toString() !== req.params.memberId);
  await project.save();
  res.status(200).json(new ApiResponse(200, {}, "Member removed"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");
  const member = project.members.find(m => m.user.toString() === req.params.memberId);
  if (!member) throw new ApiError(404, "Member not found");
  member.role = role;
  await project.save();
  res.status(200).json(new ApiResponse(200, project, "Role updated"));
});

const getMembersOfProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("members.user", "name email avatar");
  if (!project) throw new ApiError(404, "Project not found");
  res.status(200).json(new ApiResponse(200, project.members, "Members fetched"));
});

module.exports = { inviteMember, removeMember, updateMemberRole, getMembersOfProject };
