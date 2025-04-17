import { Language } from "../schemas/enum.schema";
import { cards } from "../data/cards";
import { Card } from "../schemas/card.schema";
import { createDynamicCardData } from "../utils/createDynamicCardData";

export const getCardById = async (
  id: number,
  options: { language?: Language } = { language: "en" }
) => {
  const { language } = options;
  const cardData = cards.find((card) => card.id === id);
  if (!cardData) {
    throw new Error("Card not found");
  }
  const cardVariation = [...cardData.variations]
    .reverse() // Get the last variation first
    .find((variation) => variation.language === language);
  if (!cardVariation) {
    throw new Error("Card variation not found");
  }

  const card: Card = {
    id: cardData.id,
    object: "card",
    ...cardVariation,
    ...createDynamicCardData(cardVariation),
  };

  return card;
};
