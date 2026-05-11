const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/task.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { isProjectMember } = require("../middlewares/rbac.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createTaskSchema, updateTaskSchema } = require("../validators/task.validator");

// Any project member can view and create tasks
router.get("/project/:projectId", verifyJWT, isProjectMember, getTasksByProject);
router.post("/project/:projectId", verifyJWT, isProjectMember, validate(createTaskSchema), createTask);

// Any logged in user can view single task
router.get("/:id", verifyJWT, getTaskById);

// Update and status change — controller handles ownership check
router.put("/:id", verifyJWT, validate(updateTaskSchema), updateTask);
router.patch("/:id/status", verifyJWT, updateTaskStatus);

// Delete — controller checks if admin or creator
router.delete("/:id", verifyJWT, deleteTask);

module.exports = router;