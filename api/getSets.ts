import { Hono } from "hono";
import { z } from "zod";

import { data } from "../data";
import { languageSchema } from "../schemas/enum.schema";
import { getPaginatedData } from "../utils/getPaginatedData";
import { tryCatch } from "../utils/tryCatch";

const app = new Hono();

const paramSchema = z.object({ language: languageSchema });
const querySchema = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(50).default(50),
});

app.get("/{language}/sets", async (c) => {
  const [param, paramError] = await tryCatch(
    paramSchema.parseAsync(c.req.param()),
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const [query, queryError] = await tryCatch(
    querySchema.parseAsync(c.req.query()),
  );
  if (queryError) return c.json({ error: queryError.message }, 400);

  const sets = data[param.language].sets.map((set) => ({
    ...set,
    hasAllCards: data[param.language].cards.length === set.totalCards,
  }));

  return c.json(
    getPaginatedData(sets, {
      page: query.page,
      limit: query.limit,
      language: param.language,
    }),
    200,
  );
});

export default app;
