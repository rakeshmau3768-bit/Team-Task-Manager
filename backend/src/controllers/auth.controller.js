const User = require("../models/User.model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const { setTokenCookies } = require("../utils/setCookies");
const jwt = require("jsonwebtoken");
const { JWT_REFRESH_SECRET } = require("../config/env");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

console.log(req.body)
console.log("ye role hai :", role)

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json(
    new ApiResponse(201, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    }, "Signup successful")
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  // Role mismatch check
  if (role && user.role !== role) {
    throw new ApiError(403, `This account is not registered as ${role}`);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    }, "Login successful")
  );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token");

  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  const user = await User.findById(decoded._id).select("+refreshToken");
  if (!user || user.refreshToken !== token) throw new ApiError(401, "Invalid refresh token");

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).json(new ApiResponse(200, { accessToken }, "Token refreshed"));
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
});

module.exports = { signup, login, logout, refreshToken, getMe };