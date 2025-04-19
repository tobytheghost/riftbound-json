import { z } from "zod";

import {
  foilTypeSchema,
  colorSchema,
  raritySchema,
  superTypeSchema,
  typeSchema,
  languageSchema,
} from "./enum.schema";

export type CardVariation = z.infer<typeof cardVariationSchema>;
export const cardVariationSchema = z.object({
  artist: z.string(),
  color: z.array(colorSchema),
  cost: z.number().int().min(0).optional(),
  championType: z.string().optional(),
  externalLinks: z.object({}),
  flavorText: z.string(),
  foilTypes: z.array(foilTypeSchema),
  fullIdentifier: z.string(),
  images: z.object({
    full: z.string(),
    thumbnail: z.string(),
  }),
  keywords: z.array(z.string()),
  language: languageSchema,
  might: z.number().int().min(0).optional(),
  name: z.string(),
  number: z.number().int().min(0),
  power: z.number().optional(),
  rarity: raritySchema,
  set: z.string(),
  subtypes: z.array(z.string()),
  superTypes: z.array(superTypeSchema),
  text: z.string(),
  type: typeSchema,
});

export type CardData = z.infer<typeof cardDataSchema>;
export const cardDataSchema = z.object({
  variations: z.array(cardVariationSchema),
});

export type Card = z.infer<typeof cardSchema>;
export const cardSchema = cardDataSchema
  .omit({ variations: true })
  .merge(cardVariationSchema)
  .extend({
    id: z.string(),
    object: z.literal("card"),
    fullName: z.string(),
    typeLine: z.string(),
  });
