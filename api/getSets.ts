import { data } from "@/data";
import { languageSchema } from "@/schemas/enum.schema";
import { setSchema } from "@/schemas/set.schema";
import { getPaginatedData } from "@/utils/getPaginatedData";
import { tryCatch } from "@/utils/tryCatch";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

const paramSchema = z.object({ language: languageSchema });
const querySchema = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(50).default(50),
});

app.openapi(
  createRoute({
    tags: ["Sets"],
    method: "get",
    path: "/api/{language}/sets",
    summary: "Get sets",
    description: "Get sets by language",
    request: {
      params: paramSchema,
      query: querySchema,
    },
    responses: {
      200: {
        description: "Set Data",
        content: {
          "application/json": {
            schema: z.object({
              metadata: z.object({
                generatedOn: z.date(),
                language: languageSchema,
              }),
              data: z.array(setSchema),
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
  },
);

export default app;
