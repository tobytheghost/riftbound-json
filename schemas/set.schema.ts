import { z } from "@hono/zod-openapi";
import { setCodeSchema } from "./enum.schema";

export type Set = z.infer<typeof setSchema>;

const setTypeSchema = z.enum(["expansion"]);

export const setSchema = z.object({
  prereleaseDate: z.date().optional(),
  releaseDate: z.date().optional(),
  setCode: setCodeSchema,
  name: z.string(),
  type: setTypeSchema,
  totalCards: z.number().int().min(0),
});
