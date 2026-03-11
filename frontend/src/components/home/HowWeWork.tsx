import Container from "../layout/Container";
import Heading from "../ui/Heading";
import { useTranslation } from "react-i18next";

import calidadImg from "../../assets/illustrations/calidad.png";
import disenoImg from "../../assets/illustrations/diseno.png";
import durabilidadImg from "../../assets/illustrations/durabilidad.png";

export default function HowWeWork() {

  const { t } = useTranslation();

  const items = [
    {
      key: "quality",
      image: calidadImg,
    },
    {
      key: "design",
      image: disenoImg,
    },
    {
      key: "durability",
      image: durabilidadImg,
    },
  ];

  return (
    <section className="py-28">
      <Container>

        <div className="text-center mb-20 space-y-3">

          <Heading
            level={2}
            className="text-3xl font-semibold text-gray-800"
          >
            {t("featuresTitle")}
          </Heading>

          <div className="w-16 h-[3px] bg-[#7c9a7c] mx-auto rounded-full" />

        </div>

        <div className="grid md:grid-cols-3 gap-14">

          {items.map((item) => (
            <div
              key={item.key}
              className="
                text-center
                p-8
                rounded-3xl
                bg-white
                border border-[#ece6dc]
                shadow-sm
                hover:shadow-lg
                transition-all duration-300
                hover:-translate-y-2
                group
              "
            >

              {/* Imagen */}
              <div className="flex justify-center mb-6">
                <img
                  src={item.image}
                  alt={t(item.key)}
                  className="h-36 object-contain transition duration-500 group-hover:scale-110"
                />
              </div>

              {/* Línea */}
              <div className="w-10 h-[2px] bg-[#7c9a7c]/40 mx-auto mb-4" />

              {/* Texto */}
              <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
                {t(item.key)}
              </h3>

            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}