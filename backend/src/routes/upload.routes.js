import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    res.json({
      url: result.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error subiendo imagen" });
  }
});

export default router;