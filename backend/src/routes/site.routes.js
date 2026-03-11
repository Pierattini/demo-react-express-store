import { Router } from "express";
import { pool } from "../db.js";
import { translateToEnglish } from "../services/translate.service.js";

const router = Router();

/* GET CONFIG */
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM site_config WHERE id = 1"
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo configuración" });
  }
});

/* UPDATE CONFIG */
router.put("/", async (req, res) => {
  try {
    const data = req.body;

    const about_title_en = await translateToEnglish(data.about_title);
    const about_description_en = await translateToEnglish(data.about_description);

    const about_history_title_en = await translateToEnglish(data.about_history_title);
    const about_history_text_en = await translateToEnglish(data.about_history_text);

    const about_mission_title_en = await translateToEnglish(data.about_mission_title);
    const about_mission_text_en = await translateToEnglish(data.about_mission_text);

    const about_vision_title_en = await translateToEnglish(data.about_vision_title);
    const about_vision_text_en = await translateToEnglish(data.about_vision_text);
    const brand_name_en = await translateToEnglish(data.brand_name);
    const tagline_en = await translateToEnglish(data.slogan);
    const { rows } = await pool.query(
      `
      UPDATE site_config
SET
  brand_name=$1,
  brand_name_en=$2,
  slogan=$3,
  tagline_en=$4,
  logo=$5,
  hero_image=$6,

  featured_title=$7,
  featured_subtitle=$8,

  about_title=$9,
  about_description=$10,
  about_image=$11,

  about_modal_title=$12,
  about_history_title=$13,
  about_history_text=$14,
  about_mission_title=$15,
  about_mission_text=$16,
  about_vision_title=$17,
  about_vision_text=$18,

  instagram=$19,
  tiktok=$20,
  email=$21,
  whatsapp=$22,
  phone=$23,
  address=$24,
  schedule=$25,

  bank_name=$26,
  bank_account=$27,
  bank_holder=$28,

  about_title_en=$29,
  about_description_en=$30,
  about_history_title_en=$31,
  about_history_text_en=$32,
  about_mission_title_en=$33,
  about_mission_text_en=$34,
  about_vision_title_en=$35,
  about_vision_text_en=$36

WHERE id=1
RETURNING *
      `,
      [
  data.brand_name,
  brand_name_en,
  data.slogan,
  tagline_en,
  data.logo,
  data.hero_image,

  data.featured_title,
  data.featured_subtitle,

  data.about_title,
  data.about_description,
  data.about_image,

  data.about_modal_title,
  data.about_history_title,
  data.about_history_text,
  data.about_mission_title,
  data.about_mission_text,
  data.about_vision_title,
  data.about_vision_text,

  data.instagram,
  data.tiktok,
  data.email,
  data.whatsapp,
  data.phone,
  data.address,
  data.schedule,

  data.bank_name,
  data.bank_account,
  data.bank_holder,

  about_title_en,
  about_description_en,
  about_history_title_en,
  about_history_text_en,
  about_mission_title_en,
  about_mission_text_en,
  about_vision_title_en,
  about_vision_text_en
]
    );

    res.json(rows[0]);
  } catch (error) {
  console.error("ERROR GUARDANDO SITE:", error);
  res.status(500).json({
    message: "Error guardando configuración",
    error: error.message
  });
  }
}); 
export default router;