import { Language } from "../schemas/enum.schema";
import { sets } from "../data/sets";
import { SetWithCards } from "../schemas/set.schema";
import { getAllCards } from "./getAllCards";

export const getSetBySetCode = async (
  setCode: string,
  options: { language?: Language } = { language: "en" }
) => {
  const { language } = options;
  const setData = sets.find((set) => set.setCode === setCode);
  if (!setData) {
    throw new Error("Card not found");
  }
  const setVariation = [...setData.variations]
    .reverse() // Get the last variation first
    .find((variation) => variation.language === language);
  if (!setVariation) {
    throw new Error("Card variation not found");
  }

  const set: SetWithCards = {
    id: setData.id,
    setCode: setData.setCode,
    type: setData.type,
    object: "set",
    ...setVariation,
    cards: await getAllCards({ language, setCode }),
  };

  return set;
};
