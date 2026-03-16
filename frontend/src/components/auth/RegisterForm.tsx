import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../lib/auth";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
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
      localStorage.setItem("WELCOME10", "true");

      alert("Usuario creado correctamente 🎉");
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
    <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold">
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Barra seguridad */}
        {form.password && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${strengthColor[passwordStrength]}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Seguridad: {strengthLabel[passwordStrength]}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold">
            Confirmar contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-xs text-gray-500">
          <span className="text-red-500">*</span> Campos obligatorios
        </p>
      </form>
    </div>
  );
}
