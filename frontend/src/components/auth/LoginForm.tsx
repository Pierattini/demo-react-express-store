import { useState } from "react";
import { login as loginApi } from "../../lib/auth";
import { useAuth } from "../../context/useAuth";

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
  const res = await loginApi(email, password);

login(res.accessToken, {
  ...res.user,
  role: res.user.role.toUpperCase() as "USER" | "ADMIN"
});

localStorage.setItem("refreshToken", res.refreshToken);
  onSuccess?.();
}
 catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Credenciales inválidas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
