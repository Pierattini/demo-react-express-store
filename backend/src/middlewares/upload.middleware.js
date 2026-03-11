import multer from "multer";

/* ================================
   CONFIGURACIÓN DE ALMACENAMIENTO
================================ */
const storage = multer.memoryStorage();

/* ================================
   FILTRO: SOLO IMÁGENES
================================ */
function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Solo se permiten archivos de imagen"), false);
  } else {
    cb(null, true);
  }
}

/* ================================
   MULTER CONFIG
================================ */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 🔥 10MB máximo
  },
});
