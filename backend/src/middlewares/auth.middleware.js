const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = require("../config/env");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/User.model");

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized");
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  const user = await User.findById(decoded._id).select("-password -refreshToken");
  if (!user) throw new ApiError(401, "Invalid token");
  req.user = user;
  next();
});

module.exports = { verifyJWT };