import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getReviews, createReview, updateReview, deleteReview, type Review } from "../../lib/reviews";

type FormData = { name: string; text: string; rating: number };

const emptyForm: FormData = { name: "", text: "", rating: 5 };

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch {
      setError("Error cargando reseñas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(review: Review) {
    setEditingId(review.id);
    setForm({ name: review.name, text: review.text, rating: review.rating ?? 5 });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSaving(true);
    try {
      if (editingId !== null) {
        await updateReview(editingId, form);
      } else {
        await createReview(form);
      }
      await load();
      cancelForm();
    } catch {
      setError("Error al guardar la reseña");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    try {
      await deleteReview(id);
      await load();
    } catch {
      setError("Error al eliminar");
    }
  }

  return (
    <DashboardLayout title="Reseñas">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reseñas de clientes</h2>
            <p className="text-sm text-gray-500 mt-0.5">Gestioná las reseñas que aparecen en la home</p>
          </div>
          {!showForm && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              Nueva reseña
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
            <h3 className="text-base font-semibold text-gray-900">
              {editingId !== null ? "Editar reseña" : "Nueva reseña"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nombre del cliente</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: María López"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Texto de la reseña</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  placeholder="Ej: Excelente calidad y atención..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-900/15 focus:border-gray-400 focus:bg-white transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Puntuación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, rating: n }))}
                      className={`text-2xl transition ${n <= form.rating ? "text-[#d2a24c]" : "text-gray-200 hover:text-[#d2a24c]/50"}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 self-center ml-1">{form.rating} / 5</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition"
                >
                  {saving ? "Guardando..." : editingId !== null ? "Guardar cambios" : "Crear reseña"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-3/4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-sm">No hay reseñas aún. ¡Creá la primera!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4c4ae] to-[#c4a882] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < (review.rating ?? 5) ? "text-[#d2a24c]" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(review)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
