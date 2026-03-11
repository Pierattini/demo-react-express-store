import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  getUsers,
  deleteUser,
  changeUserRole,
  updateUser,
  exportUsersExcel,

} from "../controllers/users.controller.js";


const router = express.Router();

// 🔐 TODAS protegidas + SOLO ADMIN
router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/", getUsers);
router.get("/export/excel", exportUsersExcel);
router.delete("/:id", deleteUser);
router.put("/:id/role", changeUserRole);
router.put("/:id", updateUser);

export default router;
