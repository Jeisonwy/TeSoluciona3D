import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");

function normalizeSiteUrl(url) {
  const fallback = "https://example.com";
  const candidate = (url || fallback).trim();

  try {
    const parsed = new URL(candidate);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL);

const routes = [
  "/",
  "/nosotros",
  "/products",
  "/servicios/impresion-3d",
  "/servicios/laser",
  "/servicios/mantenimiento",
];

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`).join("\n")}
</urlset>
`;

const notFoundHtml = `<!doctype html>
<html lang="es-CO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirigiendo | Tesoluciona3D</title>
    <script>
      (function () {
        var target =
          window.location.pathname +
          window.location.search +
          window.location.hash;
        window.sessionStorage.setItem("teso-spa-redirect", target);
        window.location.replace("/");
      })();
    </script>
  </head>
  <body></body>
</html>
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt);
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml);
fs.writeFileSync(path.join(publicDir, "404.html"), notFoundHtml);
