import { z } from "@hono/zod-openapi";

import {
  foilTypeSchema,
  colorSchema,
  raritySchema,
  setCodeSchema,
  superTypeSchema,
  typeSchema,
  languageSchema,
} from "./enum.schema";

export type Card = z.infer<typeof cardSchema>;

export const cardSchema = z.object({
  artist: z.string(),
  color: z.array(colorSchema),
  cost: z.number().int().min(0).optional(),
  externalLinks: z.object({}),
  flavorText: z.string(),
  foilTypes: z.array(foilTypeSchema),
  fullIdentifier: z.string(),
  id: z.number(),
  images: z.object({}),
  keywords: z.array(z.string()),
  language: languageSchema,
  might: z.number().int().min(0).optional(),
  name: z.string(),
  number: z.number().int().min(0),
  power: z.number().optional(),
  rarity: raritySchema,
  set: setCodeSchema,
  subtypes: z.array(z.string()),
  superTypes: z.array(superTypeSchema),
  text: z.string(),
  type: typeSchema,
  typeLine: z.string(),
});
