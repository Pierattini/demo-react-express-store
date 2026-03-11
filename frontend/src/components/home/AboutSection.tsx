import { useState } from "react";
import Container from "../layout/Container";
import Heading from "../ui/Heading";
import AboutModal from "./AboutModal";
import { useSiteConfig } from "../../hooks/useSiteConfig";
import { useTranslation } from "react-i18next";

export default function AboutSection() {

  const { i18n, t } = useTranslation();
  const { site } = useSiteConfig();

  const [open, setOpen] = useState(false);

  if (!site) return null;

  const isEnglish = i18n.resolvedLanguage === "en";

  const title = isEnglish
    ? site.about_title_en || site.about_title
    : site.about_title;

  const description = isEnglish
    ? site.about_description_en || site.about_description
    : site.about_description;

  const modalTitle = isEnglish
  ? site.modal_title_en || site.about_modal_title
  : site.about_modal_title;

const historyTitle = isEnglish
  ? site.about_history_title_en || site.about_history_title
  : site.about_history_title;

const historyText = isEnglish
  ? site.about_history_text_en || site.about_history_text
  : site.about_history_text;

const missionTitle = isEnglish
  ? site.about_mission_title_en || site.about_mission_title
  : site.about_mission_title;

const missionText = isEnglish
  ? site.about_mission_text_en || site.about_mission_text
  : site.about_mission_text;

const visionTitle = isEnglish
  ? site.about_vision_title_en || site.about_vision_title
  : site.about_vision_title;

const visionText = isEnglish
  ? site.about_vision_text_en || site.about_vision_text
  : site.about_vision_text;
  return (
    <>
      <section className="py-28">
        <Container>

          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div className="space-y-6">

              <Heading level={2} className="text-3xl text-gray-800">
                {title}
              </Heading>

              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>

              <button
                onClick={() => setOpen(true)}
                className="
                  mt-4 px-6 py-3 rounded-full
                  bg-[#7c9a7c] text-white
                  hover:bg-[#6b896b]
                  transition
                  shadow-md hover:shadow-lg
                "
              >
                {t("learnMore")}
              </button>

            </div>

            <div className="h-96 rounded-3xl overflow-hidden shadow-xl border border-[#e8e2d8]">

              <img
                src={site.about_image}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />

            </div>

          </div>

        </Container>
      </section>

      {open && (
        <AboutModal
          title={modalTitle}
          sections={[
            { heading: historyTitle, text: historyText },
            { heading: missionTitle, text: missionText },
            { heading: visionTitle, text: visionText }
          ]}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}