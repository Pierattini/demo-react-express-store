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
    className={`relative ${isModal ? "p-0" : ""}`}
  >

    {isModal && onClose && (
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-lg"
      >
        ✕
      </button>
    )}

    {/* Ícono decorativo */}
    <div className="flex justify-center mb-5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center shadow-xl shadow-gray-900/30 ring-1 ring-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    </div>

    <div className="mb-6 text-center">
      <Heading level={2} className="text-2xl font-bold text-gray-900">
        {t("login")}
      </Heading>
      <p className="text-sm text-gray-500 mt-1">Ingresá tu cuenta para continuar</p>
    </div>

    {error && <Alert type="error" message={error} />}

    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {t("email")}<span className="text-red-400 ml-0.5">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {t("password")}<span className="text-red-400 ml-0.5">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide mt-1 shadow-md shadow-gray-900/20"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {t("loggingIn")}
          </span>
        ) : t("loginButton")}
      </button>

    </form>

    <p className="text-center text-xs text-gray-400 mt-5">
      ¿No tenés cuenta?{" "}
      <a href="/register" className="text-gray-700 font-medium hover:underline">
        Registrate gratis
      </a>
    </p>

    </Section>
  );
}