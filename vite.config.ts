import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Carga variables de entorno (incluye las que no empiezan por VITE_)
  const env = loadEnv(mode, process.cwd(), "");

  // Para GitHub Pages: /repo/  (si tu repo es TU_USUARIO.github.io, usa "/")
  const repoName = env.REPO_NAME || "TeSoluciona3D";
  const base = env.GITHUB_PAGES_BASE || `/${repoName}/`;

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      hmr: env.DISABLE_HMR !== "true",
    },
  };
});
