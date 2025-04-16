import { data } from "../data";
import { cardSchema } from "../schemas/card.schema";
import { languageSchema, setCodeSchema } from "../schemas/enum.schema";
import { setSchema } from "../schemas/set.schema";
import { tryCatch } from "../utils/tryCatch";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const app = new OpenAPIHono();

const paramSchema = z.object({
  language: languageSchema,
  setCode: setCodeSchema,
});

app.openapi(
  createRoute({
    tags: ["Sets"],
    method: "get",
    path: "/{language}/sets/{setCode}",
    summary: "Get set by set code",
    description: "Get set by set code",
    request: {
      params: paramSchema,
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
              data: setSchema.extend({
                hasAllCards: z.boolean(),
                cards: z.array(cardSchema),
              }),
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
        description: "Set not found",
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
  },
);

export default app;
