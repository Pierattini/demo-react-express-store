import cloudinary from "../config/cloudinary.js";
import { translateToEnglish } from "../services/translate.service.js";

import {
  getAllProducts,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from "../services/products.service.js";

/* ======================
   GET PRODUCTS
====================== */
export async function getProducts(req, res, next) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

/* ======================
   CREATE PRODUCT
====================== */
export async function createProduct(req, res, next) {
  try {

    const { name, description, price, stock } = req.body;

    const variants = req.body.variants
      ? JSON.parse(req.body.variants)
      : [];

    if (!name || !price) {
      return res.status(400).json({
        message: "Nombre y precio son obligatorios",
      });
    }

    /* Traducción */
    let name_en = name;
    let description_en = description;

    try {
      name_en = await translateToEnglish(name);
      description_en = await translateToEnglish(description);
    } catch (err) {
      console.log("Translation error:", err.message);
    }

    const files = req.files || [];

    /* ======================
       IMAGEN PRINCIPAL
    ====================== */

    let image_url = null;

    const mainImage = files.find(f => f.fieldname === "image");

    if (mainImage) {

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "productos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(mainImage.buffer);

      });

      image_url = result.secure_url;

    }

    /* ======================
       IMÁGENES DE VARIANTES
    ====================== */

    const variantImages = [];

    for (let i = 0; i < variants.length; i++) {

      const file = files.find(
        f => f.fieldname === `variant_image_${i}`
      );

      if (!file) {
        variantImages.push(null);
        continue;
      }

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "productos/variantes" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(file.buffer);

      });

      variantImages.push(result.secure_url);

    }

    const colors = variants.map((v, i) => ({
      hex: v.color,
      image: variantImages[i] || null
    }));

    const product = await createProductService({
      name,
      name_en,
      description,
      description_en,
      price,
      stock: stock ?? 0,
      image_url,
      colors
    });

    res.status(201).json(product);

  } catch (error) {
    next(error);
  }
}

/* ======================
   UPDATE PRODUCT
====================== */
export async function updateProduct(req, res, next) {

  try {

    const { id } = req.params;
    const data = {};

    if (req.body.name) {
      data.name = req.body.name;

      try {
        data.name_en = await translateToEnglish(req.body.name);
      } catch {
        data.name_en = req.body.name;
      }
    }

    if (req.body.description) {
      data.description = req.body.description;

      try {
        data.description_en = await translateToEnglish(req.body.description);
      } catch {
        data.description_en = req.body.description;
      }
    }

    if (req.body.price) data.price = Number(req.body.price);
    if (req.body.stock) data.stock = Number(req.body.stock);
    if (req.body.active !== undefined) data.active = req.body.active;
    if (req.body.is_featured !== undefined)
       data.is_featured = req.body.is_featured;

    /* ======================
       VARIANTES
    ====================== */

    if (req.body.variants) {

      const variants = JSON.parse(req.body.variants);
      const files = req.files || [];

      const colors = [];

      for (let i = 0; i < variants.length; i++) {

        const file = files.find(
          f => f.fieldname === `variant_image_${i}`
        );

        let image = null;

        if (file) {

          const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
              { folder: "productos/variantes" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

            stream.end(file.buffer);

          });

          image = result.secure_url;

        }

        colors.push({
          hex: variants[i].color,
          image
        });

      }

      data.colors = colors;

    }

    /* ======================
       IMAGEN PRINCIPAL
    ====================== */

    const files = req.files || [];
    const mainImage = files.find(f => f.fieldname === "image");

    if (mainImage) {

      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "productos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(mainImage.buffer);

      });

      data.image_url = result.secure_url;

    }

    const updated = await updateProductService(id, data);

    res.json(updated);

  } catch (error) {

    console.error("ERROR ACTUALIZANDO PRODUCTO:", error);
    next(error);

  }
}

/* ======================
   DELETE PRODUCT
====================== */
export async function deleteProduct(req, res, next) {

  try {

    const { id } = req.params;

    await deleteProductService(id);

    res.json({ message: "Producto eliminado" });

  } catch (error) {
    next(error);
  }

}