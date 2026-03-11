import { useEffect, useState } from "react";
import { getSiteConfig } from "../../lib/site";
//import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState<string>("");

  useEffect(() => {
  getSiteConfig().then((data) => {
    if (data.whatsapp) {

      // quitar + y espacios
      const cleaned = data.whatsapp.replace(/\D/g, "")

      setWhatsapp(cleaned)
    }
  })
}, [])

  if (!whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, quiero más información sobre sus productos")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50
                 bg-green-500 hover:bg-green-600
                 text-white rounded-full
                 w-14 h-14 flex items-center justify-center
                 shadow-lg transition-all duration-300"
    >
      <FaWhatsapp size={32} />
    </a>
  );
}