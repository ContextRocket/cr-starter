/**
 * StructuredDataScripts -- renders JSON-LD script tags.
 *
 * Usage (Server Component only):
 *   import { buildHomeJsonLd } from "@/lib/structured-data";
 *   import { StructuredDataScripts } from "@/components/seo/structured-data-scripts";
 *
 *   <StructuredDataScripts items={buildHomeJsonLd()} />
 *
 * Adapted from context-rocket/frontend/components/public/structured-data-scripts.tsx.
 */

import { serializeJsonLd, type JsonLdNode } from "@/lib/structured-data";

export function StructuredDataScripts({ items }: { items: JsonLdNode[] }) {
  return (
    <>
      {items.map((item, index) => (
        <script
          // JSON-LD script blocks are inert data; `<` chars are escaped.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
          data-testid="json-ld"
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
