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

const institucional = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/institucional" }),
  schema: z.object({
    title: z.string(),
    sourceUrl: z.url(),
    history: z.array(z.string()),
    sections: z.array(z.object({
      title: z.string(),
      blocks: z.array(z.object({
        heading: z.string().optional(),
        paragraphs: z.array(z.string()),
      })),
    })),
    model: reference("modelos"),
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

export const collections = { modelos, programas, institucional };
