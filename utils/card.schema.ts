import { z } from "zod";

export type Card = z.infer<typeof cardSchema>;
export type CardArray = z.infer<typeof cardArraySchema>;

const colors = ["Body", "Calm", "Chaos", "Fury", "Mind", "Order"] as const;
const types = [
  "Battlefield",
  "Champion",
  "Legend",
  "Rune",
  "Spell",
  "Unit",
] as const;
const rarity = ["Common", "Uncommon", "Rare", "Epic", "Secret"] as const;
const foilTypes = ["None", "Foil"] as const;
const sets = ["OGN"] as const;
const superTypes = ["Signature"] as const;

export const cardSchema = z.object({
  artist: z.string(),
  color: z.array(z.enum(colors)),
  cost: z.number().int().min(0).optional(),
  externalLinks: z.object({}),
  flavorText: z.string(),
  foilTypes: z.array(z.enum(foilTypes)),
  fullIdentifier: z.string(),
  id: z.number(),
  images: z.object({}),
  keywords: z.array(z.string()),
  language: z.enum(["en"]),
  might: z.number().int().min(0).optional(),
  name: z.string(),
  number: z.number().int().min(0),
  power: z.number().optional(),
  rarity: z.enum(rarity),
  set: z.enum(sets),
  subtypes: z.array(z.string()),
  superTypes: z.array(z.enum(superTypes)),
  text: z.string(),
  type: z.enum(types),
  typeLine: z.string(),
});

export const cardArraySchema = z.array(cardSchema);
