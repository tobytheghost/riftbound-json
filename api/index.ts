import { Hono } from "hono";
import { handle } from "hono/vercel";
import { data } from "../data";
import { getPaginatedData } from "../utils/getPaginatedData";
import { languageSchema } from "../schemas/enum.schema";
import { z } from "zod";
import { tryCatch } from "../utils/tryCatch";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/:language/cards", async (c) => {
  const paramSchema = z.object({ language: languageSchema });
  const { data: param, error: paramError } = await tryCatch(
    paramSchema.parseAsync(c.req.param())
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const querySchema = z.object({
    page: z.coerce.number().min(1).max(1000).default(1),
    limit: z.coerce.number().min(1).max(50).default(50),
  });
  const { data: query, error: queryError } = await tryCatch(
    querySchema.parseAsync(c.req.query())
  );
  if (queryError) return c.json({ error: queryError.message }, 400);

  return c.json(
    getPaginatedData(data[param.language].cards, {
      page: query.page,
      limit: query.limit,
      language: param.language,
    })
  );
});

app.get("/:language/cards/search", async (c) => {
  const paramSchema = z.object({ language: languageSchema });
  const { data: param, error: paramError } = await tryCatch(
    paramSchema.parseAsync(c.req.param())
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const querySchema = z.object({
    q: z.string().min(1),
    page: z.coerce.number().min(1).max(1000).default(1),
    limit: z.coerce.number().min(1).max(50).default(50),
  });
  const { data: query, error: queryError } = await tryCatch(
    querySchema.parseAsync(c.req.query())
  );
  if (queryError) return c.json({ error: queryError.message }, 400);

  const searchResults = data[param.language].cards.filter(
    (card) =>
      card.name.toLowerCase().includes(query.q.toLowerCase()) ||
      card.flavorText.toLowerCase().includes(query.q.toLowerCase()) ||
      card.text.toLowerCase().includes(query.q.toLowerCase()) ||
      card.typeLine.toLowerCase().includes(query.q.toLowerCase())
  );

  return c.json(
    getPaginatedData(searchResults, {
      page: query.page,
      limit: query.limit,
      language: param.language,
    })
  );
});

app.get("/:language/cards/:id", async (c) => {
  const paramSchema = z.object({
    language: languageSchema,
    id: z.coerce.number().min(1),
  });
  const { data: param, error: paramError } = await tryCatch(
    paramSchema.parseAsync(c.req.param())
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const card = data[param.language].cards.find((card) => card.id === param.id);
  if (!card) return c.notFound();
  return c.json(card);
});

export default handle(app);
