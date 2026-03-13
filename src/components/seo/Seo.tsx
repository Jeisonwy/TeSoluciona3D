import { Helmet } from "react-helmet-async";

import {
  buildCanonical,
  getDefaultOgImage,
  siteConfig,
} from "@/lib/siteConfig";

export type JsonLd = Record<string, unknown>;
export type SchemaInput = JsonLd | JsonLd[];

export type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  robots?: string;
  schema?: SchemaInput;
  type?: "website" | "article" | "product";
};

export function Seo({
  title,
  description,
  path = "/",
  image,
  robots = "index,follow",
  schema,
  type = "website",
}: SeoProps) {
  const finalTitle = title || siteConfig.defaultTitle;
  const finalDescription = description || siteConfig.defaultDescription;
  const canonical = buildCanonical(path);
  const finalImage = image || getDefaultOgImage();
  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="es-CO" translate="no" className="notranslate" />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={robots} />
      <meta name="google" content="notranslate" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_CO" />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={siteConfig.siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {schemas.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Helmet>
  );
}
