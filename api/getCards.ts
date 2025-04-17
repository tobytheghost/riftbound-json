import { Hono } from "hono";
import { z } from "zod";

import { languageSchema } from "../schemas/enum.schema";
import { getPaginatedData } from "../utils/getPaginatedData";
import { tryCatch } from "../utils/tryCatch";
import { Card } from "../schemas/card.schema";
import { getAllCards } from "../queries/getAllCards";

const app = new Hono();

const paramSchema = z.object({ language: languageSchema });
const querySchema = z.object({
  search: z.string().min(1).optional(),
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(50).default(50),
  id: z.string().optional(),
});

app.get("/:language/cards", async (c) => {
  const [param, paramError] = await tryCatch(
    paramSchema.parseAsync(c.req.param())
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const [query, queryError] = await tryCatch(
    querySchema.parseAsync(c.req.query())
  );
  if (queryError) return c.json({ error: queryError.message }, 400);

  const { search, id } = query;

  const ids = id?.split(",").map((id) => parseInt(id, 10)) ?? [];

  const matchesSearchConditions = (card: Card, search: string) =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.flavorText.toLowerCase().includes(search.toLowerCase()) ||
    card.text.toLowerCase().includes(search.toLowerCase()) ||
    card.typeLine.toLowerCase().includes(search.toLowerCase());

  const cards = await getAllCards({ language: param.language });

  const queriedCards = cards.filter((card) => {
    if (ids.length && !ids.includes(card.id)) {
      return false;
    }
    if (search && !matchesSearchConditions(card, search)) {
      return false;
    }
    return true;
  });

  const paginatedData = getPaginatedData(queriedCards, {
    page: query.page,
    limit: query.limit,
    language: param.language,
  });

  return c.json(paginatedData, 200);
});

export default app;
