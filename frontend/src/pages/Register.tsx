import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Section from "../components/layout/Section";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import FormField from "../components/ui/FormField";
import { register } from "../lib/auth";
import { useTranslation } from "react-i18next";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const passwordStrength = useMemo(() => {
    const password = form.password;

    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, [form.password]);

  const strengthLabel = [
    t("veryWeak"),
    t("weak"),
    t("acceptable"),
    t("strong"),
    t("veryStrong"),
  ];

  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const validationError = useMemo(() => {
    if (!form.name) return t("nameRequired");
    if (!form.email.includes("@")) return t("invalidEmail");
    if (form.password.length < 6) return t("passwordMin");
    if (form.password !== form.confirmPassword) return t("passwordMatch");
    return null;
  }, [form.name, form.email, form.password, form.confirmPassword, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await register(form.name.trim(), form.email.trim(), form.password);

      localStorage.setItem("WELCOME10", "true");

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("registerUnexpectedError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section size="sm" spacing="lg">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("createAccount")}
        </h1>

        <p className="text-sm text-gray-500">
          {t("registerSubtitle")}
        </p>

        <p className="text-sm text-green-600 font-medium">
          🎁 {t("welcomeDiscount")}
        </p>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && (
        <Alert type="success" message={t("accountCreated")} />
      )}

      <Card className="p-8 space-y-6 shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">

          <FormField label={t("fullName")} required>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </FormField>

          <FormField label={t("email")} required>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </FormField>

          <FormField label={t("password")} required>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </FormField>

          {form.password && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    strengthColor[passwordStrength]
                  }`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {t("passwordSecurity")}: {strengthLabel[passwordStrength]}
              </p>
            </div>
          )}

          <FormField label={t("confirmPassword")} required>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                updateField("confirmPassword", e.target.value)
              }
            />
          </FormField>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full transition-all duration-300"
          >
            {loading ? t("creatingAccount") : t("createAccount")}
          </Button>

        </form>
      </Card>
    </Section>
  );
}