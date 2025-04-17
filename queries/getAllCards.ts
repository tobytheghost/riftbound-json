import { Language } from "../schemas/enum.schema";
import { cards } from "../data/cards";
import { Card } from "../schemas/card.schema";
import { createDynamicCardData } from "../utils/createDynamicCardData";

export const getAllCards = async (
  options: { language?: Language } = { language: "en" }
) => {
  const { language } = options;

  return cards
    .map((cardData) => {
      const cardVariation = [...cardData.variations]
        .reverse() // Get the last variation first
        .find((variation) => variation.language === language);

      if (!cardVariation) {
        return undefined; // Skip this card if no variation is found
      }

      const card: Card = {
        id: cardData.id,
        object: "card",
        ...cardVariation,
        ...createDynamicCardData(cardVariation),
      };

      return card;
    })
    .filter(Boolean);
};
