const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getMembersOfProject,
  inviteMember,
  updateMemberRole,
  removeMember,
} = require("../controllers/member.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { checkProjectRole, isProjectMember } = require("../middlewares/rbac.middleware");

// Any project member can view members
router.get("/", verifyJWT, isProjectMember, getMembersOfProject);

// Only Admin can invite, update role, remove
router.post("/", verifyJWT, checkProjectRole("Admin"), inviteMember);
router.put("/:memberId", verifyJWT, checkProjectRole("Admin"), updateMemberRole);
router.delete("/:memberId", verifyJWT, checkProjectRole("Admin"), removeMember);

module.exports = router;