const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { checkProjectRole, isProjectMember } = require("../middlewares/rbac.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createProjectSchema, updateProjectSchema } = require("../validators/project.validator");

// Anyone logged in can view and create projects
router.get("/", verifyJWT, getAllProjects);
router.post("/", verifyJWT, validate(createProjectSchema), createProject);

// Only project members can view project detail
router.get("/:id", verifyJWT, isProjectMember, getProjectById);

// Only project Admin can update or delete
router.put("/:id", verifyJWT, checkProjectRole("Admin"), validate(updateProjectSchema), updateProject);
router.delete("/:id", verifyJWT, checkProjectRole("Admin"), deleteProject);

module.exports = router;