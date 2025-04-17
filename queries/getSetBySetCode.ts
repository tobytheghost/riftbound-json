import { Language } from "../schemas/enum.schema";
import { sets } from "../data/sets";
import { SetWithCards } from "../schemas/set.schema";
import { getAllCards } from "./getAllCards";

export const getSetBySetCode = async (
  setCode: string,
  options: { language?: Language } = { language: "en" }
) => {
  const { language } = options;
  const setData = sets.find((set) =>
    set.variations.some((variation) => variation.setCode === setCode)
  );
  if (!setData) {
    throw new Error("Set not found");
  }
  const setVariation = [...setData.variations]
    .reverse() // Get the last variation first
    .find(
      (variation) =>
        variation.language === language && variation.setCode === setCode
    );
  if (!setVariation) {
    throw new Error("Set variation not found");
  }

  const set: SetWithCards = {
    id: setData.id,
    type: setData.type,
    object: "set",
    ...setVariation,
    cards: await getAllCards({ language, setCode }),
  };

  return set;
};
