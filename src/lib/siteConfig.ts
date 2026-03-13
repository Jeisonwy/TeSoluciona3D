export type BusinessConfig = {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  emailHref: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
  sameAs: string[];
};

function normalizeSiteUrl(url?: string) {
  const fallback = "https://example.com";
  const candidate = (url || fallback).trim();

  try {
    const parsed = new URL(candidate);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const siteConfig: BusinessConfig = {
  siteName: "Tesoluciona3D",
  siteUrl: normalizeSiteUrl(import.meta.env.VITE_SITE_URL),
  defaultTitle:
    "Impresión 3D en Cali | Prototipos y piezas personalizadas | Tesoluciona3D",
  defaultDescription:
    "Tesoluciona3D ofrece impresión 3D en Cali, prototipado, piezas personalizadas y soluciones a medida para empresas y clientes particulares.",
  phone: "+57 317 724 8656",
  phoneHref: "tel:+573177248656",
  whatsappHref:
    "https://wa.me/573177248656?text=Hola,%20quiero%20cotizar%20un%20proyecto%20de%20impresi%C3%B3n%203D.",
  email: "tesoluciona3d@gmail.com",
  emailHref: "mailto:tesoluciona3d@gmail.com",
  address: "KRA 32C #35-23, BR Primavera",
  city: "Cali",
  region: "Valle del Cauca",
  postalCode: "76001",
  countryCode: "CO",
  sameAs: [
    "https://www.instagram.com/tesoluciona3d/",
    "https://www.tiktok.com/@tesoluciona3d",
    "https://www.facebook.com/profile.php?id=61553602637861",
  ],
};

export function buildCanonical(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${siteConfig.siteUrl}/`).toString();
}

export function getDefaultOgImage() {
  return `${siteConfig.siteUrl}/logo.ico`;
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    image: getDefaultOgImage(),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.countryCode,
    },
    areaServed: [
      {
        "@type": "City",
        name: siteConfig.city,
      },
      {
        "@type": "AdministrativeArea",
        name: siteConfig.region,
      },
    ],
    sameAs: siteConfig.sameAs,
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    logo: getDefaultOgImage(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        areaServed: "CO",
        availableLanguage: ["es"],
      },
    ],
    sameAs: siteConfig.sameAs,
  };
}
