const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  getAllProjectsAdmin,
  addMemberToProject,
  removeMemberFromProject,
  createTaskAdmin,
  getAllTasksAdmin,
  getAdminStats,
} = require("../controllers/admin.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/rbac.middleware");

// Saare admin routes pe verifyJWT + requireRole("admin") lagega
router.use(verifyJWT, requireRole("admin"));

// Stats
router.get("/stats", getAdminStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);

// Projects
router.get("/projects", getAllProjectsAdmin);

// Project members
router.post("/projects/:id/members", addMemberToProject);
router.delete("/projects/:id/members/:memberId", removeMemberFromProject);

// Tasks
router.get("/projects/:projectId/tasks", getAllTasksAdmin);
router.post("/projects/:projectId/tasks", createTaskAdmin);

module.exports = router;