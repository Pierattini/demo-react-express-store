import { Router } from "express";

const router = Router();

const reviews = [
  {
    id: 1,
    name: "María López",
    text: "Excelente calidad y atención.",
  },
  {
    id: 2,
    name: "Carlos Pérez",
    text: "Diseño minimalista y producto duradero.",
  },
  {
    id: 3,
    name: "Ana Torres",
    text: "Muy recomendable.",
  },
];

router.get("/", (req, res) => {
  res.json(reviews);
});

export default router;
