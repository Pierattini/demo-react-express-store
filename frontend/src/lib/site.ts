import type { SiteConfig } from "../types/SiteConfig";

export async function updateSiteConfig(
  data: SiteConfig,
  token: string
): Promise<SiteConfig> {

  const res = await fetch("http://localhost:3000/api/site", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getSiteConfig(): Promise<SiteConfig> {

  const res = await fetch("http://localhost:3000/api/site");
  const data = await res.json();

  return {
    id: data.id,

    brand_name: data.brand_name,
    brand_name_en: data.brand_name_en,

    slogan: data.slogan,
    tagline_en: data.tagline_en,

    logo: data.logo || "",

    hero_image: data.hero_image,

    featured_title: data.featured_title,
    featured_title_en: data.featured_title_en,

    featured_subtitle: data.featured_subtitle,
    featured_text_en: data.featured_text_en,

    about_title: data.about_title,
    about_title_en: data.about_title_en,

    about_description: data.about_description,
    about_description_en: data.about_description_en,

    about_image: data.about_image,

    about_modal_title: data.about_modal_title,
    modal_title_en: data.modal_title_en,

    about_history_title: data.about_history_title,
    about_history_title_en: data.about_history_title_en,

    about_history_text: data.about_history_text,
    about_history_text_en: data.about_history_text_en,

    about_mission_title: data.about_mission_title,
    about_mission_title_en: data.about_mission_title_en,

    about_mission_text: data.about_mission_text,
    about_mission_text_en: data.about_mission_text_en,

    about_vision_title: data.about_vision_title,
    about_vision_title_en: data.about_vision_title_en,

    about_vision_text: data.about_vision_text,
    about_vision_text_en: data.about_vision_text_en,

    instagram: data.instagram,
    tiktok: data.tiktok,
    email: data.email,

    whatsapp: data.whatsapp,
    phone: data.phone,
    address: data.address,
    schedule: data.schedule,

    bank_name: data.bank_name,
    bank_account: data.bank_account,
    bank_holder: data.bank_holder
  };
}