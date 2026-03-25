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

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">

      {/* Imagen */}
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* contenido */}
      <div className="
        relative z-10
        flex flex-col
        justify-center
        min-h-[70vh]
        px-6 md:px-12
        text-white
      ">

        <div className="max-w-xl w-full">

          {/* TITULO */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
            {i18n.language === "en"
              ? site?.brand_name_en || site?.brand_name
              : site?.brand_name || "Nombre de la marca"}
          </h1>

          {/* SUBTITULO */}
          <p className="text-sm sm:text-lg mb-6 text-white/80">
            {i18n.language === "en"
              ? site?.tagline_en || site?.slogan
              : site?.slogan || "Eslogan"}
          </p>

          {/* BOTONES */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">

  <Link to="/catalog">
    <Button className="rounded-full px-6 py-2.5 text-sm font-medium">
      {t("catalog")}
    </Button>
  </Link>

  <Button
    onClick={() => setOpenRegister(true)}
    className="
      rounded-full px-6 py-2.5 text-sm font-medium
      bg-white/20 border border-white/30 text-white
      hover:bg-white hover:text-black
    "
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