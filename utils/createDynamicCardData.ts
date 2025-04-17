import { CardVariation } from "../schemas/card.schema";
import { exhaustiveSwitchGuard } from "./exhaustiveSwitchGuard";

export const createDynamicCardData = (
  cardVariation: CardVariation
): { typeLine: string; fullName: string } => {
  switch (cardVariation.type) {
    case "Legend":
      return {
        fullName: `${cardVariation.championType}, ${cardVariation.name}`,
        typeLine: `${cardVariation.superTypes.length ? `${cardVariation.superTypes.join(" ")} ` : ""}${cardVariation.type} • ${cardVariation.championType}`,
      };
    case "Champion":
      return {
        fullName: `${cardVariation.championType}, ${cardVariation.name}`,
        typeLine: `${cardVariation.superTypes.length ? `${cardVariation.superTypes.join(" ")} ` : ""}${cardVariation.type} • ${cardVariation.championType}`,
      };
    case "Battlefield":
    case "Rune":
    case "Spell":
    case "Unit":
      return {
        fullName: cardVariation.name,
        typeLine: `${cardVariation.superTypes.length ? `${cardVariation.superTypes.join(" ")} ` : ""}${cardVariation.type}${cardVariation.championType ? ` • ${cardVariation.championType}` : ""}`,
      };
    default:
      return exhaustiveSwitchGuard(cardVariation.type);
  }
};
