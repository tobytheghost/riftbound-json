import { z } from "zod";

export type Color = z.infer<typeof colorSchema>;
export type FoilType = z.infer<typeof foilTypeSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Rarity = z.infer<typeof raritySchema>;
export type SuperType = z.infer<typeof superTypeSchema>;
export type Type = z.infer<typeof typeSchema>;

export const color = [
  "Body",
  "Calm",
  "Chaos",
  "Fury",
  "Mind",
  "Order",
] as const;
export const colorSchema = z.enum(color);

export const foilType = ["None", "Foil"] as const;
export const foilTypeSchema = z.enum(foilType);

export const language = ["en"] as const;
export const languageSchema = z.enum(language);

export const rarity = ["Common", "Uncommon", "Rare", "Epic", "Secret"] as const;
export const raritySchema = z.enum(rarity);

export const superType = ["Champion", "Hero", "Signature"] as const;
export const superTypeSchema = z.enum(superType);

export const type = [
  "Battlefield",
  "Champion",
  "Legend",
  "Rune",
  "Spell",
  "Unit",
] as const;
export const typeSchema = z.enum(type);
