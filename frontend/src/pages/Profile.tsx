import Section from "../components/layout/Section";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import { useTranslation } from "react-i18next";

export default function Profile() {

  const { t } = useTranslation();

  return (
    <Section size="md" spacing="md">

      <Heading level={2}>
        {t("profile")}
      </Heading>

      <Card className="p-6">

        <p className="text-gray-600">
          {t("profileComing")}
        </p>

      </Card>

    </Section>
  );
}