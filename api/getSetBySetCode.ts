import { Hono } from "hono";
import { z } from "zod";

import { data } from "../data";
import { languageSchema, setCodeSchema } from "../schemas/enum.schema";
import { tryCatch } from "../utils/tryCatch";

const app = new Hono();

const paramSchema = z.object({
  language: languageSchema,
  setCode: setCodeSchema,
});

app.get("/{language}/sets/{setCode}", async (c) => {
  const [param, paramError] = await tryCatch(
    paramSchema.parseAsync(c.req.param()),
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const set = data[param.language].sets.find(
    (set) => set.setCode === param.setCode,
  );
  if (!set) return c.json({ error: "Set not found" }, 404);

  const hasAllCards = data[param.language].cards.length === set.totalCards;
  const cards = data[param.language].cards.filter(
    (card) => card.set === param.setCode,
  );
  return c.json(
    {
      metadata: {
        generatedOn: new Date(),
        language: param.language,
      },
      data: {
        ...set,
        hasAllCards,
        cards,
      },
    },
    200,
  );
});

export default app;
