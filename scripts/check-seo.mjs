import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "parse5";
import sharp from "sharp";

const origin = "https://santanderlive.uad.mx";
const dist = new URL("../dist/", import.meta.url);
const pages = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith(".html")) pages.push(path);
  }
}
await walk(dist.pathname);
assert.ok(pages.length, "Ejecuta npm run build antes de validar SEO.");

function nodes(root, predicate) {
  const result = [];
  function visit(node) {
    if (predicate(node)) result.push(node);
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(root);
  return result;
}
const attribute = (node, name) => node.attrs?.find((attr) => attr.name === name)?.value;
const text = (node) => node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(text).join("");
const titles = new Set();
const descriptions = new Set();
const indexable = new Set();
const documents = new Map();
let courses = 0;
const images = new Set();
const linksByPage = new Map();

for (const file of pages) {
  const path = `/${file.slice(dist.pathname.length)}`.replace(/index\.html$/, "");
  const document = parse(await readFile(file, "utf8"));
  documents.set(path, document);
}
for (const [path, document] of documents) {
  const find = (tag) => nodes(document, (node) => node.tagName === tag);
  const linkedPages = new Set();
  linksByPage.set(path, linkedPages);
  const meta = (name) => find("meta").filter((node) => attribute(node, "name") === name || attribute(node, "property") === name);
  const value = (name) => {
    const entries = meta(name);
    assert.equal(entries.length, 1, `${path}: ${name} debe aparecer una vez`);
    return attribute(entries[0], "content");
  };
  assert.equal(find("h1").length, 1, `${path}: se requiere un H1`);
  assert.equal(find("title").length, 1, `${path}: se requiere un título`);
  const title = text(find("title")[0]);
  const description = value("description");
  assert.ok(description?.trim(), `${path}: falta descripción`);
  assert.ok(title.endsWith(" | Santander Live Streaming"), `${path}: marca incorrecta`);
  assert.ok(!titles.has(title), `${path}: título repetido`);
  assert.ok(!descriptions.has(description), `${path}: descripción repetida`);
  titles.add(title);
  descriptions.add(description);
  const canonicalTags = find("link").filter((node) => attribute(node, "rel") === "canonical");
  assert.equal(canonicalTags.length, 1, `${path}: canonical duplicado o ausente`);
  const canonical = attribute(canonicalTags[0], "href");
  assert.equal(canonical, `${origin}${path}`, `${path}: canonical no coincide con la ruta`);
  if (!meta("robots").some((node) => attribute(node, "content")?.includes("noindex"))) indexable.add(canonical);
  else assert.equal(path, "/404.html", "Una página pública está marcada noindex");
  assert.equal(value("og:url"), canonical);
  assert.equal(value("og:title"), title);
  assert.equal(value("og:description"), description);
  assert.equal(value("og:locale"), "es_MX");
  assert.equal(value("og:site_name"), "Santander Live Streaming");
  assert.equal(value("twitter:card"), "summary_large_image");
  assert.equal(value("twitter:title"), title);
  assert.equal(value("twitter:description"), description);
  assert.equal(value("twitter:image"), value("og:image"));
  assert.equal(value("og:image:width"), "1200");
  assert.equal(value("og:image:height"), "630");
  assert.ok(value("og:image:alt"));
  const image = new URL(value("og:image"));
  assert.equal(image.origin, origin);
  images.add(image.pathname);
  assert.equal(attribute(find("html")[0], "lang"), "es-MX");
  for (const img of find("img")) assert.notEqual(attribute(img, "alt"), undefined, `${path}: imagen sin alt`);
  const scripts = find("script").filter((node) => attribute(node, "type") === "application/ld+json");
  assert.equal(scripts.length, 1, `${path}: debe existir un único grafo JSON-LD`);
  const graph = JSON.parse(text(scripts[0]));
  assert.equal(graph["@context"], "https://schema.org");
  const ids = new Set(graph["@graph"].map((node) => node["@id"]));
  assert.equal(ids.size, graph["@graph"].length, `${path}: identificadores JSON-LD repetidos`);
  function checkReferences(object) {
    if (!object || typeof object !== "object") return;
    if (Object.keys(object).length === 1 && object["@id"]) assert.ok(ids.has(object["@id"]), `${path}: referencia JSON-LD sin entidad`);
    for (const value of Object.values(object)) checkReferences(value);
  }
  checkReferences(graph);
  const university = graph["@graph"].find((node) => node["@type"] === "CollegeOrUniversity");
  assert.equal(university.url, "https://uadlobos.mx/");
  assert.deepEqual(university.sameAs, ["https://www.facebook.com/uadmx", "https://www.instagram.com/lobosuadmx"]);
  const course = graph["@graph"].find((node) => node["@type"] === "Course");
  if (path.startsWith("/licenciaturas/") || path.startsWith("/posgrados/")) {
    assert.ok(course, `${path}: falta Course`);
    assert.equal(course.url, canonical);
    assert.equal(course.description, description);
    assert.match(course.name, /^(Licenciatura|Maestría|Doctorado) en /);
    assert.equal(course.provider["@id"], university["@id"]);
    courses++;
  }
  if (path !== "/" && path !== "/404.html") {
    const breadcrumb = graph["@graph"].find((node) => node["@type"] === "BreadcrumbList");
    assert.equal(breadcrumb.itemListElement[0].item, `${origin}/`);
    assert.equal(breadcrumb.itemListElement.at(-1).item, canonical);
  }
  if (path === "/") {
    const catalog = graph["@graph"].find((node) => node["@type"] === "ItemList");
    assert.equal(catalog.numberOfItems, 24);
    assert.equal(new Set(catalog.itemListElement.map((item) => item.url)).size, 24);
    for (const item of catalog.itemListElement) assert.ok(documents.has(new URL(item.url).pathname));
  }
  for (const anchor of find("a")) {
    const href = attribute(anchor, "href");
    if (!href || /^(tel:|mailto:)/.test(href)) continue;
    const url = new URL(href, canonical);
    if (url.origin !== origin || url.pathname.startsWith("/plataforma/")) continue;
    const target = documents.get(url.pathname);
    assert.ok(target, `${path}: enlace interno sin destino: ${href}`);
    linkedPages.add(url.pathname);
    if (url.hash) assert.ok(nodes(target, (node) => attribute(node, "id") === decodeURIComponent(url.hash.slice(1))).length, `${path}: ancla sin destino: ${href}`);
  }
}
assert.equal(courses, 24);
assert.equal(indexable.size, 27);
assert.ok(!indexable.has(`${origin}/404.html`));

const distances = new Map([["/", 0]]);
const queue = ["/"];
for (const page of queue) {
  for (const target of linksByPage.get(page) ?? []) {
    if (!distances.has(target)) {
      distances.set(target, distances.get(page) + 1);
      queue.push(target);
    }
  }
}
for (const url of indexable) {
  const distance = distances.get(new URL(url).pathname);
  assert.ok(distance !== undefined && distance <= 3, `${url}: página huérfana o a más de tres clics`);
}

for (const image of images) {
  const info = await sharp(join(dist.pathname, decodeURIComponent(image))).metadata();
  assert.equal(info.width, 1200);
  assert.equal(info.height, 630);
  assert.equal(info.format, "jpeg");
}
const sitemapIndex = await readFile(new URL("sitemap-index.xml", dist), "utf8");
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapUrls = new Set();
for (const url of locations(sitemapIndex)) {
  assert.equal(new URL(url).origin, origin);
  const sitemap = await readFile(join(dist.pathname, new URL(url).pathname), "utf8");
  for (const page of locations(sitemap)) sitemapUrls.add(page);
}
assert.deepEqual([...sitemapUrls].sort(), [...indexable].sort(), "Sitemap y páginas indexables difieren");
assert.match(await readFile(new URL("robots.txt", dist), "utf8"), /Sitemap: https:\/\/santanderlive\.uad\.mx\/sitemap-index\.xml/);

// CSV generated by the inventory has no multiline cells; honor quoted commas.
const csv = await readFile(new URL("../reference/seo/redirects.csv", import.meta.url), "utf8");
const rows = csv.trim().split(/\r?\n/).slice(1);
const sources = new Set();
for (const row of rows) {
  const cells = [...row.matchAll(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g)].map((match) => match[1].replace(/^"|"$/g, "").replace(/""/g, '"'));
  const [source, target, status] = cells;
  assert.ok(!sources.has(source), `Redirección repetida: ${source}`);
  assert.ok(!source.startsWith("/plataforma/"));
  sources.add(source);
  if (status === "301") {
    const url = new URL(target, origin);
    assert.ok(documents.has(url.pathname), `Destino de redirección inexistente: ${target}`);
    assert.ok(!sources.has(target), `Posible cadena de redirecciones: ${target}`);
  } else {
    assert.equal(status, "410");
    assert.equal(target, "");
  }
}
await stat(new URL("404.html", dist));
console.log(`SEO verificado: ${indexable.size} páginas indexables, ${courses} programas, ${images.size} imágenes sociales y ${rows.length} rutas antiguas.`);
