const express = require("express");
const router = express.Router();
const { signup, login, logout, refreshToken, getMe } = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { signupSchema, loginSchema } = require("../validators/auth.validator");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshToken);
router.get("/me", verifyJWT, getMe);

module.exports = router;
