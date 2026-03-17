import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useSiteConfig } from "../../hooks/useSiteConfig";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Modal from "../ui/Modal";
import RegisterForm from "../auth/RegisterForm";

export default function Banner() {
  
  const { i18n, t } = useTranslation();
  const { site } = useSiteConfig();
  const [openRegister, setOpenRegister] = useState(false);

  console.log(site);
  console.log("Idioma actual:", i18n.language);

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">

      {/* Imagen */}
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* overlay oscuro */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* contenido */}
      <div className="relative z-10 flex min-h-[70vh] items-start pt-64 px-6 md:px-12 text-white">
        <div className="max-w-xl">

          {/* TÍTULO */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {i18n.language === "en"
              ? site?.brand_name_en || site?.brand_name
              : site?.brand_name || "Nombre de la marca"}
          </h1>

          <p className="text-lg mb-8 text-white/80">
            {i18n.language === "en"
              ? site?.tagline_en || site?.slogan
              : site?.slogan || "Eslogan"}
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-4">

            <Link to="/catalog">
              <Button className="rounded-full px-8 py-3">
                {t("catalog")}
              </Button>
            </Link>

            <Button
              onClick={() => setOpenRegister(true)}
              variant="secondary"
              className="rounded-full px-8 py-3 bg-white/20 border border-white/30 text-white hover:bg-white hover:text-black"
            >
              {t("createAccount")}
            </Button>

          </div>

        </div>
      </div>

      {/* MODAL REGISTER */}
      <Modal open={openRegister} onClose={() => setOpenRegister(false)}>
        <div className="relative">

          <button
            onClick={() => setOpenRegister(false)}
            className="absolute top-4 right-4 text-xl text-gray-400 hover:text-black"
          >
            ✕
          </button>

          <RegisterForm />

        </div>
      </Modal>

    </section>
  );
}