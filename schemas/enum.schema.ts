import { z } from "zod";

export type Color = z.infer<typeof colorSchema>;
export type FoilType = z.infer<typeof foilTypeSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Rarity = z.infer<typeof raritySchema>;
export type SetCode = z.infer<typeof setCodeSchema>;
export type SuperType = z.infer<typeof superTypeSchema>;
export type Type = z.infer<typeof typeSchema>;

export const colorSchema = z.enum([
  "Body",
  "Calm",
  "Chaos",
  "Fury",
  "Mind",
  "Order",
]);

export const foilTypeSchema = z.enum(["None", "Foil"]);

export const languageSchema = z.enum(["en"]);

export const raritySchema = z.enum([
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Secret",
]);

export const setCodeSchema = z.enum(["OGN"]);

export const superTypeSchema = z.enum(["Signature"]);

export const typeSchema = z.enum([
  "Battlefield",
  "Champion",
  "Legend",
  "Rune",
  "Spell",
  "Unit",
]);
