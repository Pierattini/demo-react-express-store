import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../lib/auth";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  onClose?: () => void;
};

export default function RegisterForm({ onClose }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
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

    return score; // 0..4
  }, [form.password]);

  const strengthLabel = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"];

  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const validationError = useMemo(() => {
    if (!form.name.trim()) return "El nombre es obligatorio";
    if (!form.email.trim().includes("@")) return "Email inválido";
    if (form.password.length < 6) return "La contraseña debe tener mínimo 6 caracteres";
    if (form.password !== form.confirmPassword) return "Las contraseñas no coinciden";
    return null;
  }, [form.name, form.email, form.password, form.confirmPassword]);

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

      // ✅ descuento
      localStorage.setItem("Descuento 10%", "true");

      alert("Usuario creado correctamente 🎉");

onClose?.();   // ← esto cierra el modal
navigate("/");

      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error inesperado al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">

      {/* Header */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center shadow-xl shadow-gray-900/30 ring-1 ring-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear cuenta</h2>
        <p className="text-sm text-gray-500 mt-1">Completá tus datos para registrarte</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Nombre completo <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Tu nombre"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Email <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Contraseña <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Barra seguridad */}
        {form.password && (
          <div className="space-y-1 px-1">
            <div className="flex gap-1">
              {[0,1,2,3].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? strengthColor[passwordStrength] : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="text-xs text-gray-500">Seguridad: <span className="font-medium">{strengthLabel[passwordStrength]}</span></p>
          </div>
        )}

        {/* Confirmar contraseña */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Confirmar contraseña <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="••••••••"
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
              Creando cuenta...
            </span>
          ) : "Crear cuenta"}
        </button>

        <p className="text-center text-xs text-gray-400 pt-1">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="text-gray-700 font-medium hover:underline">
            Iniciá sesión
          </a>
        </p>

      </form>
    </div>
  );
}
