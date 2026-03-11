import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No se envió archivo" });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "store" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    res.json({
      url: result.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error subiendo imagen" });
  }
});

export default router;