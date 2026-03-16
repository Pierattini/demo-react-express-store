import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useSiteConfig } from "../../hooks/useSiteConfig";
import { useTranslation } from "react-i18next";


export default function Banner() {
  
  const { i18n, t } = useTranslation();
  const { site } = useSiteConfig();
console.log(site); // ← agregar
console.log("Idioma actual:", i18n.language)
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">

      {/* Imagen */}
      <img
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* overlay oscuro */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* contenido */}
      <div className="relative z-10 flex h-full items-end pb-28 px-6 md:px-12 text-white">
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

            <Link to="/register">
              <Button
                variant="secondary"
                className="rounded-full px-8 py-3 bg-white/20 border border-white/30 text-white hover:bg-white hover:text-black"
              >
                {t("createAccount")}
              </Button>
            </Link>

          </div>

        </div>
      </div>

    </section>
  );
}