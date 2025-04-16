import { data } from "../data";
import { cardSchema } from "../schemas/card.schema";
import { languageSchema } from "../schemas/enum.schema";
import { getPaginatedData } from "../utils/getPaginatedData";
import { tryCatch } from "../utils/tryCatch";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const app = new OpenAPIHono();

const paramSchema = z.object({ language: languageSchema });
const querySchema = z.object({
  q: z.string().min(1).optional(),
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(50).default(50),
});

app.openapi(
  createRoute({
    tags: ["Cards"],
    method: "get",
    path: "/{language}/cards",
    summary: "Get cards",
    description: "Get cards by language",
    request: {
      params: paramSchema,
      query: querySchema,
    },
    responses: {
      200: {
        description: "Card Data",
        content: {
          "application/json": {
            schema: z.object({
              metadata: z.object({
                generatedOn: z.date(),
                language: languageSchema,
              }),
              data: z.array(cardSchema),
              page: z.number(),
              limit: z.number(),
              total: z.number(),
            }),
          },
        },
      },
      400: {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const [param, paramError] = await tryCatch(
      paramSchema.parseAsync(c.req.param()),
    );
    if (paramError) return c.json({ error: paramError.message }, 400);

    const [query, queryError] = await tryCatch(
      querySchema.parseAsync(c.req.query()),
    );
    if (queryError) return c.json({ error: queryError.message }, 400);

    const { q } = query;

    const queriedCards = q
      ? data[param.language].cards.filter(
          (card) =>
            card.name.toLowerCase().includes(q.toLowerCase()) ||
            card.flavorText.toLowerCase().includes(q.toLowerCase()) ||
            card.text.toLowerCase().includes(q.toLowerCase()) ||
            card.typeLine.toLowerCase().includes(q.toLowerCase()),
        )
      : data[param.language].cards;

    const paginatedData = getPaginatedData(queriedCards, {
      page: query.page,
      limit: query.limit,
      language: param.language,
    });

    return c.json(paginatedData, 200);
  },
);

export default app;
