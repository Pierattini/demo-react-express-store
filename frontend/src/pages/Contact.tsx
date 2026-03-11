import { useState } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import { useTranslation } from "react-i18next";
import { useSiteConfig } from "../hooks/useSiteConfig";

export default function Contact() {

  const { t } = useTranslation();
  const { site } = useSiteConfig();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="min-h-screen bg-[#f6f2ea] pt-24 pb-24">

      <Container className="space-y-14">

        {/* HEADER */}
        <header className="text-center space-y-3">

          <Heading
            level={2}
            className="text-4xl font-semibold text-gray-800"
          >
            {t("contact")}
          </Heading>

          <p className="text-gray-500 text-sm">
            {t("contactSubtitle")}
          </p>

        </header>

        {/* GRID PRO */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* INFORMACIÓN EMPRESA */}
          <Card className="p-8 rounded-3xl border border-[#ece6dc] shadow-md bg-white space-y-6">

            <h3 className="text-xl font-semibold text-gray-800">
              {t("contactInfo")}
            </h3>

            <div className="space-y-4 text-gray-600 text-sm">

              <div>
                <p className="font-medium text-gray-800">{t("email")}</p>
                <p>contacto@mitienda.com</p>
              </div>

              <div>
                <p className="font-medium text-gray-800">{t("phone")}</p>
                <p>+56 9 1234 5678</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Dirección</p>
                <p>{site?.address}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">{t("schedule")}</p>
                <p>{t("scheduleValue")}</p>
              </div>

            </div>

            <div className="pt-6 border-t border-[#ece6dc]">

              <p className="text-sm text-gray-500">
                {t("contactResponse")}
              </p>

            </div>

          </Card>

          {/* FORMULARIO */}
          <Card className="p-8 rounded-3xl border border-[#ece6dc] shadow-md bg-white">

            <form className="space-y-6">

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-700">
                  {t("name")}
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#ece6dc] focus:outline-none focus:ring-2 focus:ring-[#7c9a7c] transition"
                  placeholder={t("namePlaceholder")}
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-700">
                  {t("email")}
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#ece6dc] focus:outline-none focus:ring-2 focus:ring-[#7c9a7c] transition"
                  placeholder="tucorreo@email.com"
                />

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-700">
                  {t("message")}
                </label>

                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#ece6dc] focus:outline-none focus:ring-2 focus:ring-[#7c9a7c] transition resize-none"
                  placeholder={t("messagePlaceholder")}
                />

              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#7c9a7c] text-white font-medium hover:bg-[#6b896b] transition duration-300 shadow-sm"
              >
                {t("sendMessage")}
              </button>

            </form>

          </Card>

        </div>
        {/* MAPA */}

<div className="mt-16 max-w-4xl mx-auto">

  <Card className="p-6 rounded-3xl border border-[#ece6dc] shadow-md bg-white">

    <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
      Cómo llegar
    </h3>

    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site?.address || "")}`}
      target="_blank"
      rel="noopener noreferrer"
    >

      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(site?.address || "")}&output=embed`}
        width="100%"
        height="350"
        style={{ border: 0 }}
        loading="lazy"
        className="rounded-xl"
      />

    </a>

  </Card>

</div>
      </Container>

    </section>
  );
}