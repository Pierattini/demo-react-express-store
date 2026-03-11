import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import { useTranslation } from "react-i18next";

export default function About() {

  const { t } = useTranslation();

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <Heading level={2}>
          {t("about")}
        </Heading>

        <Card className="p-6 space-y-4">
          <p className="text-gray-600">
            {t("aboutText1")}
          </p>

          <p className="text-gray-600">
            {t("aboutText2")}
          </p>
        </Card>
      </div>
    </Container>
  );
}