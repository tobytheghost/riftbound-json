import { handle } from "hono/vercel";
import { Hono } from "hono";

import "@total-typescript/ts-reset";

import getCards from "./getCards";
import getCardById from "./getCardsById";
// import getSets from "./getSets";
// import getSetBySetCode from "./getSetBySetCode";

export const config = {
  runtime: "edge",
};

const app = new Hono();

app.route("/", getCards);
app.route("/", getCardById);
// app.route("/", getSets);
// app.route("/", getSetBySetCode);

export default handle(app);
