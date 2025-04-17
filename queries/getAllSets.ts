import { Language } from "../schemas/enum.schema";
import { sets } from "../data/sets";
import { Set } from "../schemas/set.schema";

export const getAllSets = async (
  options: { language?: Language } = { language: "en" }
) => {
  const { language } = options;

  return sets
    .map((setData) => {
      const setVariation = [...setData.variations]
        .reverse() // Get the last variation first
        .find((variation) => variation.language === language);

      if (!setVariation) {
        return undefined; // Skip this set if no variation is found
      }

      const set: Set = {
        id: setData.id,
        object: "set",
        type: setData.type,
        ...setVariation,
      };

      return set;
    })
    .filter(Boolean);
};
