const { NODE_ENV } = require("../config/env");

const setTokenCookies = (res, accessToken, refreshToken) => {
  const options = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  };
  res.cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

module.exports = { setTokenCookies };