import { Hono } from "hono";
import { z } from "zod";

import { languageSchema, setCodeSchema } from "../schemas/enum.schema";
import { tryCatch } from "../utils/tryCatch";
import { getSetBySetCode } from "../queries/getSetBySetCode";

const app = new Hono();

const paramSchema = z.object({
  language: languageSchema,
  setCode: setCodeSchema,
});

app.get("/:language/sets/:setCode", async (c) => {
  const [param, paramError] = await tryCatch(
    paramSchema.parseAsync(c.req.param())
  );
  if (paramError) return c.json({ error: paramError.message }, 400);

  const [set, setError] = await tryCatch(getSetBySetCode(param.setCode));
  if (setError || !set) return c.json({ error: "Set not found" }, 404);

  return c.json(set, 200);
});

export default app;
