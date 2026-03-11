import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getFeaturedProducts } from "../services/products.service.js";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";

const router = express.Router();

/* ======================
   PUBLIC
====================== */
router.get("/", getProducts);
router.get("/featured", async (req, res) => {
  try {
    const products = await getFeaturedProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo productos destacados" });
  }
});

/* ======================
   ADMIN
====================== */

// 🔥 CREAR PRODUCTO CON IMAGEN
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  upload.any(), // 👈 IMPORTANTE
  createProduct
);

// 🔥 ACTUALIZAR PRODUCTO CON IMAGEN OPCIONAL
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  upload.any(), // 👈 también aquí
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteProduct
);

export default router;
