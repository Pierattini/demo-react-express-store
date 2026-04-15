import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import productsRoutes from "./routes/products.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import siteRoutes from "./routes/site.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://demo-react-express-store.vercel.app",
  "https://demo-react-express-store-git-main-pierattinis-projects.vercel.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

/* rutas */
app.use("/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/site", siteRoutes);
app.use("/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFoundMiddleware);

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});