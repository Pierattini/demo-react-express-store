import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/ui/Alert";
import { login as loginApi } from "../lib/auth";
import { useAuth } from "../context/useAuth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import Section from "../components/layout/Section";
import Heading from "../components/ui/Heading";
import { useTranslation } from "react-i18next";

type Props = {
  isModal?: boolean;
  onClose?: () => void;
};

export default function Login({ isModal, onClose }: Props) {

  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      if (isModal && onClose) {
        onClose(); // cerrar modal
      } else {
        navigate(from, { replace: true }); // redirigir si es página
      }
    }
  }, [isAuthenticated, isModal, onClose, navigate, from]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      const res = await loginApi(email, password);

      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      login(res.accessToken, res.user);

      if (isModal && onClose) {
        onClose();
      }

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : t("invalidCredentials")
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Section
      size="sm"
      spacing="md"
      className={isModal ? "p-0" : ""}
    >

      <Heading level={2}>
        {t("login")}
      </Heading>

      {error && <Alert type="error" message={error} />}

      <Card className="p-6">

        <form onSubmit={handleSubmit} className="space-y-4">

          <FormField label={t("email")} required>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </FormField>

          <FormField label={t("password")} required>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </FormField>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? t("loggingIn") : t("loginButton")}
          </Button>

        </form>

      </Card>

    </Section>
  );
}