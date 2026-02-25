import { useState, useEffect } from "react";

const PASSWORD = "JeisonPro"; // cámbiala aquí

export default function Gate({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("teso_auth");
    if (saved === "true") setAuthorized(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem("teso_auth", "true");
      setAuthorized(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 p-8 rounded-xl border border-white/10 w-[320px]"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Dev Access</h2>

          <input
            type="password"
            placeholder="Contraseña"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg mb-4 outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 py-3 rounded-lg font-bold"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return children;
}
