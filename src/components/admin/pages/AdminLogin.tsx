import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://www.tesoluciona3d.com/api";

type SessionResponse = {
  success: boolean;
  authenticated: boolean;
  username?: string;
  message?: string;
};

type LoginResponse = {
  success: boolean;
  authenticated?: boolean;
  message?: string;
};

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API}/admin_session.php`, {
          method: "GET",
          credentials: "include",
        });

        const data: SessionResponse = await res.json();

        if (data.success && data.authenticated) {
          navigate("/admin/dashboard", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Error verificando sesión admin:", err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/admin_login.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success || !data.authenticated) {
        setError(data.message || "Credenciales inválidas");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Error en login admin:", err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <p className="text-zinc-300">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Admin Tesoluciona3D</h1>
          <p className="text-zinc-400 mt-2">
            Inicia sesión para acceder al panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoComplete="username"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 outline-none focus:border-zinc-500"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
