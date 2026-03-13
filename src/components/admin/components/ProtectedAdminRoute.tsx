import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API = "https://www.tesoluciona3d.com/api";

type Props = {
  children: React.ReactNode;
};

type SessionResponse = {
  success: boolean;
  authenticated: boolean;
  username?: string;
  message?: string;
};

export default function ProtectedAdminRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API}/admin_session.php`, {
          method: "GET",
          credentials: "include",
        });

        const data: SessionResponse = await res.json();

        if (data.success && data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validando sesión admin:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Verificando acceso...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
