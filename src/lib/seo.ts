import type { CollectionEntry } from "astro:content";
import { absoluteUrl, site } from "../data/site";

export type SchemaNode = Record<string, unknown>;
export const universityId = absoluteUrl("#university");
export const websiteId = absoluteUrl("#website");
const brandId = absoluteUrl("#brand");

export function programName(program: CollectionEntry<"programas">): string {
  const prefix = program.data.categoria === "doctorado" ? "Doctorado" :
    program.data.categoria === "maestria" ? "Maestría" : "Licenciatura";
  return `${prefix} en ${program.data.title}`;
}

export function programUrl(program: CollectionEntry<"programas">): string {
  return absoluteUrl(`/${program.data.nivel}/${program.data.slug}/`);
}

export function courseSchema(program: CollectionEntry<"programas">): SchemaNode {
  const url = programUrl(program);
  return {
    "@type": "Course",
    "@id": `${url}#course`,
    name: programName(program),
    description: program.data.seoDescription,
    url,
    inLanguage: site.language,
    provider: { "@id": universityId },
  };
}

export function identitySchema(logo: string): SchemaNode[] {
  return [
    {
      "@type": "CollegeOrUniversity",
      "@id": universityId,
      name: site.university.name,
      url: site.university.url,
      address: { "@type": "PostalAddress", ...site.university.address },
      telephone: site.university.phones.map((phone) => phone.value),
      sameAs: [...site.university.sameAs],
      brand: { "@id": brandId },
    },
    { "@type": "Brand", "@id": brandId, name: site.name, url: site.url, logo },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: site.name,
      url: site.url,
      inLanguage: site.language,
      publisher: { "@id": universityId },
    },
  ];
}

export function breadcrumbSchema(url: string, name: string): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };
}

export function serializeSchema(nodes: SchemaNode[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
}
