export const site = {
  name: "Santander Live Streaming",
  url: "https://santanderlive.uad.mx/",
  language: "es-MX",
  university: {
    name: "Universidad Autónoma de Durango",
    url: "https://uadlobos.mx/",
    address: {
      streetAddress: "Avenida Universidad Autónoma de Durango #300, Fracc. Jardines de Durango",
      addressLocality: "Durango",
      addressRegion: "Durango",
      postalCode: "34200",
      addressCountry: "MX",
    },
    phones: [
      { label: "(52) 618 129 5786", value: "+526181295786" },
      { label: "(52) 618 129 5901", value: "+526181295901" },
    ],
    sameAs: ["https://www.facebook.com/uadmx", "https://www.instagram.com/lobosuadmx"],
  },
  socials: [
    { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/uadmx" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/lobosuadmx" },
    { label: "X", icon: "x", href: undefined },
    { label: "TikTok", icon: "tiktok", href: undefined },
    {
      label: "WhatsApp",
      icon: "whatsapp",
      href: "https://api.whatsapp.com/send/?phone=526181102529&text=Me+interesa+recibir+m%C3%A1s+informaci%C3%B3n+de+las+licenciaturas&type=phone_number&app_absent=0",
    },
  ],
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

export function canonicalUrl(pathname: string): string {
  const path = pathname === "/" || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname.replace(/\/+$/, "")}/`;
  return absoluteUrl(path);
}
