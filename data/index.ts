import { z } from "@hono/zod-openapi";
import { Card, cardSchema } from "../schemas/card.schema";
import { Language } from "../schemas/enum.schema";
import { Set, setSchema } from "../schemas/set.schema";

import cardsEn from "./en/cards_en.json";
import setsEn from "./en/sets_en.json";

export type Data = Record<Language, { cards: Card[]; sets: Set[] }>;

export const data: Data = {
  en: {
    cards: z.array(cardSchema).parse(cardsEn),
    sets: z.array(setSchema).parse(setsEn),
  },
};
