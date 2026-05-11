const User = require("../models/User.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  );
  res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");
  user.password = newPassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

module.exports = { getProfile, updateProfile, changePassword };