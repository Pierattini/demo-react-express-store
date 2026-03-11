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

app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* 👇 AGREGA ESTO AQUÍ */
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});