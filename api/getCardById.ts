import { data } from "@/data";
import { cardSchema } from "@/schemas/card.schema";
import { languageSchema } from "@/schemas/enum.schema";
import { tryCatch } from "@/utils/tryCatch";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

const paramSchema = z.object({
  language: languageSchema,
  id: z.coerce.number().min(1),
});

app.openapi(
  createRoute({
    tags: ["Cards"],
    method: "get",
    path: "/{language}/cards/{id}",
    summary: "Get card by ID",
    description: "Get card by card ID",
    request: {
      params: paramSchema,
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
              data: cardSchema,
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
      404: {
        description: "Card not found",
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

    const card = data[param.language].cards.find(
      (card) => card.id === param.id,
    );
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
  },
);

export default app;
