import { Hono } from "hono";
import { z } from "zod";

import { languageSchema } from "../schemas/enum.schema";
import { tryCatch } from "../utils/tryCatch";
import { getCardById } from "../queries/getCardById";

const app = new Hono();

const paramSchema = z.object({
  id: z.coerce.number().int().min(1),
  language: languageSchema,
});

app.get("/:language/cards/:id", async (c) => {
  const [param, paramError] = await tryCatch(
    paramSchema.parseAsync(c.req.param())
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const card = await getCardById(param.id, { language: param.language });
  if (!card) return c.json({ error: "Card not found" }, 404);

  return c.json(card, 200);
});

export default app;
