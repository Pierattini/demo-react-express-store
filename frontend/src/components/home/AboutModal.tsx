import { X } from "lucide-react";

type Section = {
  heading: string;
  text: string;
};

type Props = {
  title: string;
  sections: Section[];
  onClose: () => void;
};

export default function AboutModal({ title, sections, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Barra superior premium */}
        <div className="h-2 bg-[#7c9a7c]" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition"
        >
          <X size={22} />
        </button>

        <div className="p-12 space-y-12">

          {/* Título dinámico */}
          <div>
            <h2 className="text-4xl font-semibold text-gray-900">
              {title}
            </h2>
            <div className="w-16 h-[3px] bg-[#7c9a7c] mt-4 rounded" />
          </div>

          {/* Secciones dinámicas */}
          <div className="grid md:grid-cols-3 gap-10">
            {sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {section.heading}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
