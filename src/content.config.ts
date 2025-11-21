import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
    }),
});

// 🔴 BURAYI DEĞİŞTİR
const guides = defineCollection({
  // loader kullanma, bunu "content collection" olarak bırak
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readTime: z.string().optional(),
    difficulty: z.enum(["Başlangıç", "Orta", "İleri"]).optional(),
    category: z.string().optional(),
    playlist: z.string().optional(),
    playlistTitle: z.string().optional(),
    order: z.number().optional(),
    lang: z.enum(["tr", "en"]).default("tr"),
  }),
});

export const collections = { blog, guides };
