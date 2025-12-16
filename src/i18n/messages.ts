export const languages = {
  tr: "Türkçe",
  en: "English",
} as const;

export const messages = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      knowledgeCenter: "İçeriklerimiz",
      technicalGuides: "Yazılar & Rehberler",
      glossary: "Terimler Sözlüğü",
      applications: "Uygulamalar",
      generatorSelector: "Jeneratör Seçim Rehberi",
      maintenanceAssistant: "Bakım-Onarım Asistanı",
      projects: "Projeler",
      contact: "Danışmanlık & iletişim",
    },
    footer: {
      description:
        "Jeneratör ve enerji çözümlerinde doğru seçimi yapmanız için tarafsız ve teknik odaklı bir rehber sunuyoruz.",
      quickLinks: "Hızlı Linkler",
      followUs: "Bizi Takip Edin",
      rights: "Tüm hakları saklıdır.",
    },
  },
  en: {
    nav: {
      home: "Home",
      knowledgeCenter: "Knowledge Center",
      technicalGuides: "Technical Guides",
      glossary: "Glossary",
      applications: "Applications",
      generatorSelector: "Generator Selection Guide",
      maintenanceAssistant: "Maintenance Assistant",
      projects: "Projects",
      contact: "Contact",
    },
    footer: {
      description:
        "We provide an independent, technically focused guide to help you choose the right generator and energy solutions.",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      rights: "All rights reserved.",
    },
  },
} as const;

export type Lang = keyof typeof messages;

// Küçük bir helper: "nav.home" gibi key'leri çözer
export function useTranslations(lang: Lang) {
  const dict = messages[lang] ?? messages.tr;

  return (key: string): string => {
    return key.split(".").reduce<any>((obj, part) => obj?.[part], dict) ?? key;
  };
}
