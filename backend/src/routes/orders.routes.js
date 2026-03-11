import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  createOrderController,
  getMyOrders,
  getOrderDetail,
  getAllOrdersController,
  changeOrderStatusController,
  cancelOrderController,
  deleteOrderController,
  updateOrderController
} from "../controllers/orders.controller.js";

const router = express.Router();

// USER
router.post("/", createOrderController); // ← quitamos auth
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderDetail);

// ADMIN
router.get("/", authMiddleware, requireRole("admin"), getAllOrdersController);
router.put("/:id/status", authMiddleware, requireRole("admin"), changeOrderStatusController);
router.put("/:id/cancel", authMiddleware, requireRole("admin"), cancelOrderController);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteOrderController);
router.put("/:id", authMiddleware, requireRole("admin"), updateOrderController);

export default router;