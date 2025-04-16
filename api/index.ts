import { handle } from "hono/vercel";
import { data } from "@/data";
import { languageSchema, setCodeSchema } from "@/schemas/enum.schema";
import { getPaginatedData } from "@/utils/getPaginatedData";
import { tryCatch } from "@/utils/tryCatch";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cardSchema } from "@/schemas/card.schema";
import { setSchema } from "@/schemas/set.schema";

export const config = {
  runtime: "edge",
};

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: "get",
    path: "/api/{language}/cards",
    summary: "Get cards",
    description: "Get cards by language",
    request: {
      params: z.object({ language: languageSchema }),
      query: z.object({
        q: z.string().min(1).optional(),
        page: z.coerce.number().min(1).max(1000).default(1),
        limit: z.coerce.number().min(1).max(50).default(50),
      }),
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
    const paramSchema = z.object({ language: languageSchema });
    const [param, paramError] = await tryCatch(
      paramSchema.parseAsync(c.req.param()),
    );
    if (paramError) return c.json({ error: paramError.message }, 400);

    const querySchema = z.object({
      q: z.string().min(1).optional(),
      page: z.coerce.number().min(1).max(1000).default(1),
      limit: z.coerce.number().min(1).max(50).default(50),
    });
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

app.openapi(
  createRoute({
    method: "get",
    path: "/api/{language}/cards/{id}",
    summary: "Get card by ID",
    description: "Get card by card ID",
    request: {
      params: z.object({
        language: languageSchema,
        id: z.coerce.number().min(1),
      }),
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
    console.log(c.req.param());
    const paramSchema = z.object({
      language: languageSchema,
      id: z.coerce.number().min(1),
    });
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

app.openapi(
  createRoute({
    method: "get",
    path: "/api/{language}/sets",
    summary: "Get sets",
    description: "Get sets by language",
    request: {
      params: z.object({ language: languageSchema }),
      query: z.object({
        page: z.coerce.number().min(1).max(1000).default(1),
        limit: z.coerce.number().min(1).max(50).default(50),
      }),
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
    const paramSchema = z.object({ language: languageSchema });
    const [param, paramError] = await tryCatch(
      paramSchema.parseAsync(c.req.param()),
    );
    if (paramError) return c.json({ error: paramError.message }, 400);

    const querySchema = z.object({
      page: z.coerce.number().min(1).max(1000).default(1),
      limit: z.coerce.number().min(1).max(50).default(50),
    });
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

app.openapi(
  createRoute({
    method: "get",
    path: "/api/{language}/sets/{setCode}",
    summary: "Get set by set code",
    description: "Get set by set code",
    request: {
      params: z.object({ language: languageSchema, setCode: setCodeSchema }),
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
    const paramSchema = z.object({
      language: languageSchema,
      setCode: setCodeSchema,
    });
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

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  }),
);

app.doc("/doc", {
  info: {
    title: "An API",
    version: "v1",
  },
  openapi: "3.1.0",
});

export default handle(app);
