import { useEffect, useState } from "react";

export default function Loader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="font-brand text-3xl tracking-[0.1em]">
            TESOLUCIONA3D
          </h1>
          <div className="mt-4 w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
