import { useState } from "react";
import { MessageCircle, Mail, X } from "lucide-react";

export default function FloatingContactButton() {
  const [open, setOpen] = useState(false);

  const whatsappNumber = "573177248656";
  const emailAddress = "tesoluciona3d@gmail.com";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>

        <a
          href={`mailto:${emailAddress}`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg"
        >
          <Mail size={18} />
          Correo
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-4 rounded-full shadow-xl"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {open ? "Cerrar" : "Contáctanos"}
      </button>
    </div>
  );
}
