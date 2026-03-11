import Container from "../layout/Container";
import Heading from "../ui/Heading";
import Card from "../ui/Card";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Review = {
  id: number;
  name: string;
  text: string;
};

export default function Testimonials() {

  const { t } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/reviews")
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-24">
      <Container>

        <div className="text-center mb-16 space-y-3">

          <Heading level={2} className="text-3xl font-semibold text-gray-800">
            {t("reviewsTitle")}
          </Heading>

          <p className="text-sm text-gray-500">
            {t("reviewsSubtitle")}
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-10">

          {reviews.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setOpen(open === index ? null : index)}
              className="cursor-pointer"
            >

              <Card className="p-7 rounded-3xl border border-[#ece6dc] bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

                <div className="space-y-5">

                  <div className="flex gap-1 text-[#7c9a7c] text-sm">
                    ★★★★★
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
                    {open === index
                      ? item.text
                      : item.text.length > 65
                        ? item.text.slice(0, 65) + "..."
                        : item.text}
                  </p>

                  <p className="font-medium text-sm text-gray-800">
                    {item.name}
                  </p>

                </div>

              </Card>

            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}