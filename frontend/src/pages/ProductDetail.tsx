import { Link, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Section from "../components/layout/Section";
import Heading from "../components/ui/Heading";
import { useTranslation } from "react-i18next";

export default function ProductDetail() {

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <Section size="md" spacing="md">

      <Link
        to="/catalog"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← {t("back")}
      </Link>

      <Heading level={2}>
        {t("productDetail")}
      </Heading>

      <Card className="p-6 space-y-3">

        <p className="text-gray-600">
          {t("productId")}: <strong>{id}</strong>
        </p>

        <p className="text-gray-700">
          {t("productDetailComing")}
        </p>

      </Card>

    </Section>
  );
}