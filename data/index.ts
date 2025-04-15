import { Card } from "../schemas/card.schema";
import { Language } from "../schemas/enum.schema";
import { Set } from "../schemas/set.schema";

import { cards } from "./en/cards.json";
import { sets } from "./en/sets.json";

export type Data = Record<Language, { cards: Card[]; sets: Set[] }>;

export const data: Data = {
  en: {
    cards,
    sets,
  },
};
