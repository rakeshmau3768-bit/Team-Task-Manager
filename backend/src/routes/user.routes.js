const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

router.get("/me", verifyJWT, getProfile);
router.put("/me", verifyJWT, updateProfile);
router.put("/me/password", verifyJWT, changePassword);

module.exports = router;
