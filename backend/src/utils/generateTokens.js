const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY } = require("../config/env");

const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
};

module.exports = { generateAccessToken, generateRefreshToken };