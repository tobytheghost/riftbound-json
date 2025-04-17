import { CardData } from "../schemas/card.schema";

export const cards: CardData[] = [
  {
    id: 161,
    variations: [
      {
        name: "Deadbloom Predator",
        artist: "Slawomir Maniak",
        color: ["Body"],
        cost: 8,
        externalLinks: {},
        keywords: ["Deflect"],
        flavorText:
          "The souls of those who died unfulfilled coalesce into a form to sate those hungers.",
        foilTypes: ["None"],
        fullIdentifier: "OGN • 161/298",
        images: {
          full: "https://drive.google.com/thumbnail?id=1pcMxoLkCIpxFnplS44QmzVLrMWbTz8lf&sz=w1000",
        },
        language: "en",
        might: 8,
        number: 161,
        power: 2,
        rarity: "Epic",
        set: "OGN",
        subtypes: ["Shadow Isles"],
        superTypes: [],
        text: "[Deflect] (Opponents must pay {*} to choose me with a spell or ability.)\nYou may play me to an occupied enemy battlefield.",
        type: "Unit",
      },
    ],
  },

  {
    id: 251,
    variations: [
      {
        artist: "Sugar Free",
        color: ["Fury", "Chaos"],
        championType: "Jinx",
        externalLinks: {},
        flavorText: "",
        foilTypes: ["None"],
        fullIdentifier: "OGN • 251/298",
        images: {
          full: "https://drive.google.com/thumbnail?id=1rZsQUivzx-jqutCwf0dCmO_HLeRtk_Sv&sz=w1000",
        },
        keywords: [],
        language: "en",
        name: "Loose Cannon",
        number: 251,
        rarity: "Rare",
        set: "OGN",
        superTypes: [],
        subtypes: [],
        text: "At start of your Beginning Phase, draw 1 if you have 1 or fewer cards in your hand.",
        type: "Legend",
      },
    ],
  },

  {
    id: 252,
    variations: [
      {
        artist: "Kudos Productions",
        color: ["Fury", "Chaos"],
        cost: 4,
        championType: "Jinx",
        externalLinks: {},
        flavorText: "",
        foilTypes: ["None"],
        fullIdentifier: "OGN • 252/298",
        images: {
          full: "https://drive.google.com/thumbnail?id=1pDKK_Xns7AM5xLSFZOYbP_IxwHKd4Hta&sz=w1000",
        },
        keywords: [],
        language: "en",
        name: "Super Mega Death Rocket!",
        number: 252,
        rarity: "Epic",
        set: "OGN",
        subtypes: [],
        superTypes: ["Signature"],
        text: "Deal 5 to a unit.\nWhen you conquer, you may discard 1 to return this from your trash to your hand.",
        type: "Spell",
      },
    ],
  },

  {
    id: 265,
    variations: [
      {
        artist: "Fortiche Production",
        color: ["Mind", "Order"],
        externalLinks: {},
        flavorText: "",
        foilTypes: ["None"],
        fullIdentifier: "OGN • 265/298",
        images: {
          full: "https://drive.google.com/thumbnail?id=125ETiJrekeRelRdBpT_gye1-C90vkufM&sz=w1000",
        },
        keywords: [],
        language: "en",
        name: "Herald of the Arcane",
        number: 265,
        rarity: "Rare",
        set: "OGN",
        subtypes: ["Viktor"],
        superTypes: [],
        text: "{1}, {E}: Play a 1{M} Recruit unit token.",
        type: "Legend",
      },
    ],
  },
];
