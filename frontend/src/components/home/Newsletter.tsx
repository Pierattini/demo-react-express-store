import Container from "../layout/Container";
import Heading from "../ui/Heading";
import { Instagram, Mail } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Newsletter() {

  const { t } = useTranslation();

  return (
    <section className="py-24">
      <Container>

        <div className="max-w-xl mx-auto text-center space-y-10">

          <Heading level={2} className="text-3xl font-semibold text-gray-800">
            {t("connectTitle")}
          </Heading>

          <p className="text-gray-500 text-sm">
            {t("connectSubtitle")}
          </p>

          <div className="flex justify-center gap-10 mt-6">

            {/* Instagram */}
            <a
              href="https://instagram.com/tuempresa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="
                h-14 w-14
                rounded-full
                bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600
                flex items-center justify-center
                shadow-md
                hover:scale-110
                hover:shadow-lg
                transition-all duration-300
              ">
                <Instagram className="w-7 h-7 text-white" />
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@tuempresa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="
                h-14 w-14
                rounded-full
                bg-[#7c9a7c]
                flex items-center justify-center
                shadow-md
                hover:scale-110
                hover:shadow-lg
                transition-all duration-300
              ">
                <FaTiktok className="w-7 h-7 text-white" />
              </div>
            </a>

            {/* Email */}
            <a href="mailto:contacto@tuempresa.com">
              <div className="
                h-14 w-14
                rounded-full
                bg-[#6b896b]
                flex items-center justify-center
                shadow-md
                hover:scale-110
                hover:shadow-lg
                transition-all duration-300
              ">
                <Mail className="w-7 h-7 text-white" />
              </div>
            </a>

          </div>

        </div>

      </Container>
    </section>
  );
}