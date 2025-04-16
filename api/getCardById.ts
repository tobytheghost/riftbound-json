import { Hono } from "hono";
import { z } from "zod";

import { data } from "../data";
import { languageSchema } from "../schemas/enum.schema";
import { tryCatch } from "../utils/tryCatch";

const app = new Hono();

const paramSchema = z.object({
  language: languageSchema,
  id: z.coerce.number().min(1),
});

app.get("/{language}/cards/{id}", async (c) => {
  const [param, paramError] = await tryCatch(
    paramSchema.parseAsync(c.req.param()),
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const card = data[param.language].cards.find((card) => card.id === param.id);
  if (!card) return c.json({ error: "Card not found" }, 404);

  return c.json(
    {
      metadata: {
        generatedOn: new Date(),
        language: param.language,
      },
      data: card,
    },
    200,
  );
});

export default app;
