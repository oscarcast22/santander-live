import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const modelos = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/modelos" }),
  schema: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
  }),
});

const programas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/programas" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      nivel: z.enum(["licenciaturas", "posgrados"]),
      categoria: z.enum(["maestria", "doctorado"]).optional(),
      overview: z.array(z.string()).default([]),
      model: reference("modelos"),
      heroImage: image(),
      curriculum: z.array(
        z.object({
          period: z.string(),
          subjects: z.array(z.string()),
        }),
      ),
      graduateProfile: z.array(z.string()).optional(),
      sourceNote: z.string().optional(),
    }),
});

export const collections = { modelos, programas };
