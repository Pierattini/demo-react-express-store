import { useEffect, useMemo, useState } from "react";
import { getSiteConfig, updateSiteConfig } from "../../lib/site";
import { useAuth } from "../../context/useAuth";
import type { SiteConfig } from "../../types/SiteConfig";
import { CheckCircle2, Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout"; 
import AddressAutocomplete from "../../components/ui/AddressAutocomplete";
import { uploadImage } from "../../lib/upload";
type UploadField = "hero_image" | "about_image" | "logo";
/* ========= VALIDATIONS ========= */
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidUrl = (url: string) => {
  if (!url) return true; // permitir vacío
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidImageUrl = (url: string) => isValidUrl(url) && /^https?:\/\//.test(url);

/* ========= COMPONENTS ========= */
function TextField(props: {
  label: string;
  name: keyof SiteConfig;
  value: string;
  placeholder?: string;
  type?: "text" | "email" | "url";
  maxLength?: number;
  help?: string;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const {
    label,
    name,
    value,
    placeholder,
    type = "text",
    maxLength,
    help,
    error,
    onChange,
  } = props;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        className={[
          "w-full border p-2.5 rounded-lg outline-none",
          "focus:ring-2 focus:ring-[#7c9a7c]",
          error ? "border-red-400" : "border-gray-300",
        ].join(" ")}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">{help ?? ""}</div>
        {typeof maxLength === "number" && (
          <div className="text-xs text-gray-400">
            {(value ?? "").length}/{maxLength}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextAreaField(props: {
  label: string;
  name: keyof SiteConfig;
  value: string;
  placeholder?: string;
  maxLength: number;
  help?: string;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const { label, name, value, placeholder, maxLength, help, error, onChange } = props;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">{label}</label>

      <textarea
        name={name}
        value={value ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        rows={3}
        className={[
          "w-full border p-2.5 rounded-lg outline-none resize-none",
          "focus:ring-2 focus:ring-[#7c9a7c]",
          error ? "border-red-400" : "border-gray-300",
        ].join(" ")}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500">{help ?? ""}</div>
        <div className="text-xs text-gray-400">
          {(value ?? "").length}/{maxLength}
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ImageUploadField(props: {
  label: string;
  help?: string;
  imageUrl: string;
  uploading: boolean;
  inputId: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { label, help, imageUrl, uploading, inputId, onUpload } = props;

  const hasImage = useMemo(() => isValidImageUrl(imageUrl), [imageUrl]);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">{label}</label>
        {help && <p className="text-xs text-gray-500">{help}</p>}
      </div>

      {/* Botón bonito + input oculto */}
      <div className="flex items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />

        <label
          htmlFor={inputId}
          className={[
            "inline-flex items-center gap-2",
            "px-4 py-2 rounded-full cursor-pointer",
            "bg-[#7c9a7c] text-white hover:bg-[#6b896b] transition",
            uploading ? "opacity-70 pointer-events-none" : "",
          ].join(" ")}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              Elegir imagen
            </>
          )}
        </label>

        {/* Estado a la derecha */}
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {uploading ? (
            <span className="text-gray-500">Procesando…</span>
          ) : hasImage ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-700">Imagen cargada</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Sin imagen</span>
            </>
          )}
        </div>
      </div>

      {/* Preview SOLO si existe URL válida */}
      {hasImage && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Preview"
            className="h-40 w-full max-w-md rounded-xl object-cover border border-gray-200 shadow-sm"
          />
        </div>
      )}
    </div>
  );
}

/* ========= MAIN ========= */
export default function AdminSite() {
  const { token } = useAuth();

  const [form, setForm] = useState<SiteConfig>({
  id: 1,

  brand_name: "",
  slogan: "",

  logo: "",

  hero_image: "",

  featured_title: "",
  featured_subtitle: "",

  about_title: "",
  about_description: "",
  about_image: "",

  about_modal_title: "",

  about_history_title: "",
  about_history_text: "",

  about_mission_title: "",
  about_mission_text: "",

  about_vision_title: "",
  about_vision_text: "",

  instagram: "",
  tiktok: "",
  email: "",

  whatsapp: "",
  phone: "",
  address: "",
  schedule: "",

  bank_name: "",
  bank_account: "",
  bank_holder: ""
});
  const [uploadingField, setUploadingField] = useState<UploadField | null>(null);


  const [errors, setErrors] = useState<Partial<Record<keyof SiteConfig, string>>>({});

  useEffect(() => {
  getSiteConfig().then((data) => {
    setForm((prev) => ({
      ...prev,
      ...data,
    }));
  });
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  

  const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  field: UploadField
) => {
  if (!e.target.files) return;

  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("image", file);

  try {
    setUploadingField(field);

    const data = await uploadImage(formData);

    setForm((prev) => ({
      ...prev,
      [field]: data.url,
    }));

  } catch {
    alert("Error subiendo imagen");
  } finally {
    setUploadingField(null);
  }
};



  const validate = () => {
    const nextErrors: Partial<Record<keyof SiteConfig, string>> = {};

    // Email: permitir vacío, pero si hay valor debe ser válido
    if ((form.email || "").trim() && !isValidEmail((form.email || "").trim())) {
  nextErrors.email = "Correo inválido. Ej: contacto@tuempresa.com";
}

    // Instagram / TikTok: permitir vacío, pero si hay valor debe ser URL
    if ((form.instagram || "").trim() && (!isValidUrl((form.instagram || "").trim()) || !form.instagram.includes("instagram.com"))) {
  nextErrors.instagram = "Debe ser un link válido de Instagram.";
}

    if ((form.tiktok || "").trim() && (!isValidUrl((form.tiktok || "").trim()) || !form.tiktok.includes("tiktok.com"))) {
  nextErrors.tiktok = "Debe ser un link válido de TikTok.";
}

    // Imágenes: si hay valor, que sea URL válida
    if ((form.hero_image || "").trim() && !isValidImageUrl((form.hero_image || "").trim())) {
  nextErrors.hero_image = "La URL de la imagen del banner no es válida.";
}

    if ((form.about_image || "").trim() && !isValidImageUrl((form.about_image || "").trim())) {
  nextErrors.about_image = "La URL de la imagen 'Sobre nosotros' no es válida.";
}

    // Descripción: ejemplo límite 200
    if (form.about_description.length > 500) {
      nextErrors.about_description = "Máximo 500 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!token) return;

    if (!validate()) {
      alert("Corrige los campos marcados antes de guardar.");
      return;
    }

    await updateSiteConfig(form, token);
    alert("Guardado correctamente");
  };

  return (
  <DashboardLayout title="Configuración del Sitio">
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-8">
        <TextField
  label="Nombre de tu empresa"
  name="brand_name"
  value={form.brand_name || ""}
  placeholder="Ej: MiEmpresa"
  onChange={handleChange}
/>
<ImageUploadField
  label="Logo de la empresa"
  help="Recomendado: PNG transparente. Tamaño ideal: 400x120."
  imageUrl={form.logo || ""}
  uploading={uploadingField === "logo"}
  inputId="logoUpload"
  onUpload={(e) => handleImageUpload(e, "logo")}
/>
<TextField
  label="Frase o eslogan principal"
  name="slogan"
  value={form.slogan || ""}
  placeholder="Ej: Diseño minimalista para tu hogar"
  onChange={handleChange}
/>

<ImageUploadField
  label="Imagen principal del banner"
  help="Recomendado: 1920x1080. JPG/PNG/WebP. Máx recomendado: 8MB."
  imageUrl={form.hero_image || ""}
  uploading={uploadingField === "hero_image"}
  inputId="heroImageUpload"
  onUpload={(e) => handleImageUpload(e, "hero_image")}
/>

<TextField
  label="Título sección productos destacados"
  name="featured_title"
  value={form.featured_title || ""}
  placeholder="Ej: Productos destacados"
  onChange={handleChange}
/>

<TextField
  label="Texto debajo del título de productos"
  name="featured_subtitle"
  value={form.featured_subtitle || ""}
  placeholder="Ej: Selección especial de nuestros productos"
  onChange={handleChange}
/>

<TextField
  label='Título sección "Sobre nosotros"'
  name="about_title"
  value={form.about_title || ""}
  placeholder="Ej: Sobre la empresa"
  onChange={handleChange}
/>

<TextAreaField
  label="Descripción sobre tu empresa"
  name="about_description"
  value={form.about_description || ""}
  placeholder="Un texto corto y claro (lo verá el cliente en la portada)."
  maxLength={500}
  help="Máximo 500 caracteres."
  error={errors.about_description ?? null}
  onChange={handleChangeTextArea}
/>

<div className="border-t pt-8 space-y-6">
  <h3 className="text-lg font-semibold text-gray-900">
    Contenido ventana emergente "Más sobre nuestra empresa"
  </h3>

  <TextField
    label="Título principal del modal"
    name="about_modal_title"
    value={form.about_modal_title || ""}
    onChange={handleChange}
  />

  <TextField
    label="Título sección Historia"
    name="about_history_title"
    value={form.about_history_title || ""}
    onChange={handleChange}
  />

  <TextAreaField
    label="Texto Historia"
    name="about_history_text"
    value={form.about_history_text || ""}
    maxLength={400}
    onChange={handleChangeTextArea}
  />

  <TextField
    label="Título sección Misión"
    name="about_mission_title"
    value={form.about_mission_title || ""}
    onChange={handleChange}
  />

  <TextAreaField
    label="Texto sección Misión"
    name="about_mission_text"
    value={form.about_mission_text || ""}
    maxLength={400}
    onChange={handleChangeTextArea}
  />

  <TextField
    label="Título sección Visión"
    name="about_vision_title"
    value={form.about_vision_title || ""}
    onChange={handleChange}
  />

  <TextAreaField
    label="Texto Visión"
    name="about_vision_text"
    value={form.about_vision_text || ""}
    maxLength={400}
    onChange={handleChangeTextArea}
  />
</div>

<ImageUploadField
  label='Imagen sección "Sobre nosotros"'
  help="Recomendado: 800x800. JPG/PNG/WebP. Máx recomendado: 8MB."
  imageUrl={form.about_image || ""}
  uploading={uploadingField === "about_image"}
  inputId="aboutImageUpload"
  onUpload={(e) => handleImageUpload(e, "about_image")}
/>

<TextField
  label="Link de Instagram"
  name="instagram"
  value={form.instagram || ""}
  placeholder="https://instagram.com/tuempresa"
  type="url"
  error={errors.instagram ?? null}
  onChange={handleChange}
/>

<TextField
  label="Link de TikTok"
  name="tiktok"
  value={form.tiktok || ""}
  placeholder="https://tiktok.com/@tuempresa"
  type="url"
  error={errors.tiktok ?? null}
  onChange={handleChange}
/>

<TextField
  label="Correo de contacto"
  name="email"
  value={form.email || ""}
  placeholder="contacto@tuempresa.com"
  type="email"
  error={errors.email ?? null}
  onChange={handleChange}
/>

<div className="border-t pt-8 space-y-6">
  <h3 className="text-lg font-semibold text-gray-900">
    Información de contacto
  </h3>

  <TextField
    label="Número de WhatsApp"
    name="whatsapp"
    value={form.whatsapp || ""}
    placeholder="Ej: 56912345678 (sin + ni espacios)"
    onChange={handleChange}
  />

  <TextField
    label="Teléfono"
    name="phone"
    value={form.phone || ""}
    placeholder="Ej: +56 9 1234 5678"
    onChange={handleChange}
  />

  <div className="space-y-2">
  <label className="text-sm font-medium text-gray-800">
    Dirección
  </label>

  <AddressAutocomplete
    value={form.address || ""}
    onChange={(val: string) =>
      setForm((prev) => ({ ...prev, address: val }))
    }
  />
</div>

  <TextField
    label="Horario"
    name="schedule"
    value={form.schedule || ""}
    placeholder="Ej: Lunes a Viernes 9:00 - 18:00"
    onChange={handleChange}
  />
</div>

<div className="border-t pt-8 space-y-6">
  <h3 className="text-lg font-semibold text-gray-900">
    Datos de cuenta bancaria (Transferencia)
  </h3>

  <TextField
    label="Nombre del banco"
    name="bank_name"
    value={form.bank_name || ""}
    onChange={handleChange}
  />

  <TextField
    label="Número de cuenta"
    name="bank_account"
    value={form.bank_account || ""}
    onChange={handleChange}
  />

  <TextField
    label="Titular de la cuenta"
    name="bank_holder"
    value={form.bank_holder || ""}
    onChange={handleChange}
  />
</div>

        {/* Save */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#7c9a7c] hover:bg-[#6b896b] text-white rounded-full transition shadow-sm"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
);
}
