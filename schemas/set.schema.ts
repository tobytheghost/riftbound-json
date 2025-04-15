import { z } from "zod";

export type Set = z.infer<typeof setSchema>;

export const setSchema = z.object({});
