const express = require("express");
const router = express.Router();
const { getStats, getOverdueTasks, getRecentActivity } = require("../controllers/dashboard.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

router.get("/stats", verifyJWT, getStats);
router.get("/overdue", verifyJWT, getOverdueTasks);
router.get("/activity", verifyJWT, getRecentActivity);

module.exports = router;
