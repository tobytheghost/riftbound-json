import { handle } from "hono/vercel";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

import getCards from "./getCards";
import getCardById from "./getCardById";
import getSets from "./getSets";
import getSetBySetCode from "./getSetBySetCode";

export const config = {
  runtime: "edge",
};

const app = new OpenAPIHono();

app.route("/", getCards);
app.route("/", getCardById);
app.route("/", getSets);
app.route("/", getSetBySetCode);

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  }),
);

app.doc("/doc", {
  info: {
    title: "Riftbound: League of Legends TCG - Community API",
    version: "v1",
    description: [
      "## What is this?",
      "This is a community API for Riftbound: League of Legends TCG.",
      "This project aims to collect data about the cards in the Riftbound: League of Legends TCG, and to make that data accessible an in an easy-to-use format.",
      "It's aimed at developers of Riftbound: League of Legends TCG tools and websites, rather than the general player base.",
      "---",
      "RiftboundData uses trademarks and/or copyrights associated with Riftbound: League of Legends TCG and Riot Games, Inc.",
      "We will not charge you to use or access this.",
      "RiftboundData is not affiliated with or endorsed by Riot Games, Inc. or any of its affiliates. All associated properties are trademarks and/or copyrights of Riot Games, Inc.",
      "For more information, please visit the [Riot Games](https://www.riotgames.com/en) website.",
    ].join("\n\n"),
  },
  openapi: "3.1.0",
});

export default handle(app);
