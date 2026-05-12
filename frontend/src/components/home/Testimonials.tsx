import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getReviews, type Review } from "../../lib/reviews";
import Container from "../layout/Container";
import Heading from "../ui/Heading";

export default function Testimonials() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    getReviews().then(setReviews).catch(console.error);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-28 bg-[radial-gradient(ellipse_at_top,#f7f2e9_0%,#f8fafc_60%,#f2f4f7_100%)]">
      <Container>

        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="inline-flex items-center rounded-full border border-[#e9deca] bg-[#fef9ef] px-4 py-1.5 text-xs font-semibold tracking-widest text-[#8d6d3f] uppercase">
            Testimonios
          </span>
          <Heading level={2} className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("reviewsTitle")}
          </Heading>
          <p className="mx-auto max-w-md text-sm text-gray-500 md:text-base">
            {t("reviewsSubtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((item, index) => {
            const isOpen = open === index;
            const isLong = item.text.length > 140;
            const body = isOpen || !isLong ? item.text : `${item.text.slice(0, 140)}...`;
            const rating = item.rating ?? 5;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-[#ebe2d3] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#d4c4ae]"
              >
                {/* Comilla decorativa */}
                <div className="absolute -right-1 -top-2 text-[90px] leading-none text-[#f4ead8] select-none font-serif">"</div>

                <div className="relative space-y-5">

                  {/* Estrellas + badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${i < rating ? "text-[#d2a24c]" : "text-gray-200"}`} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      Verificado ✓
                    </span>
                  </div>

                  {/* Texto */}
                  <p className="min-h-[88px] text-sm leading-relaxed text-gray-600 md:text-[15px] italic">
                    "{body}"
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="text-xs font-semibold text-[#8d6d3f] hover:text-[#6f532b] transition"
                    >
                      {isOpen ? "Ver menos ↑" : "Ver más ↓"}
                    </button>
                  )}

                  {/* Autor */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[#f1eadf]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4c4ae] to-[#c4a882] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">Cliente</p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}
