import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { buildCanonical } from "@/lib/siteConfig";

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: buildCanonical(item.path) } : {}),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <>
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-sm text-slate-400"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className="transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white" : undefined}>
                    {item.label}
                  </span>
                )}
                {!isLast ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
