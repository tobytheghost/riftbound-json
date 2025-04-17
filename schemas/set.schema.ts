import { set, z } from "zod";
import { languageSchema, setCodeSchema } from "./enum.schema";

const setTypeSchema = z.enum(["expansion"]);

export type SetVariation = z.infer<typeof setVariationSchema>;
export const setVariationSchema = z.object({
  name: z.string(),
  language: languageSchema,
  prereleaseDate: z.date().optional(),
  releaseDate: z.date().optional(),
  totalCards: z.number().int().min(0),
});

export type SetData = z.infer<typeof setDataSchema>;
export const setDataSchema = z.object({
  id: z.string().uuid(),
  setCode: setCodeSchema,
  type: setTypeSchema,
  variations: z.array(setVariationSchema),
});

export type Set = z.infer<typeof setSchema>;
export const setSchema = setDataSchema
  .omit({ variations: true })
  .merge(setVariationSchema)
  .extend({
    object: z.literal("set"),
  });
