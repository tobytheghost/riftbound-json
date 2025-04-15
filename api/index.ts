import { Hono } from "hono";
import { handle } from "hono/vercel";
import cards from "../data/en/cards.json";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

app.get("/cards", async (c) => {
  const { page = 1, limit = 10 } = c.req.query();
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const start = (pageNumber - 1) * limitNumber;
  const end = start + limitNumber;
  const paginatedCards = cards.slice(start, end);
  return c.json({
    cards: paginatedCards,
    total: cards.length,
    page: pageNumber,
    limit: limitNumber,
  });
});

app.get("/cards/search", async (c) => {
  const { q, page = 1, limit = 10 } = c.req.query();
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const start = (pageNumber - 1) * limitNumber;
  const end = start + limitNumber;
  const searchResults = cards.filter(
    (card) =>
      card.name.toLowerCase().includes((q as string).toLowerCase()) ||
      card.flavorText.toLowerCase().includes((q as string).toLowerCase()) ||
      card.text.toLowerCase().includes((q as string).toLowerCase()) ||
      card.typeLine.toLowerCase().includes((q as string).toLowerCase())
  );
  const paginatedCards = searchResults.slice(start, end);
  return c.json({
    cards: paginatedCards,
    total: searchResults.length,
    page: pageNumber,
    limit: limitNumber,
  });
});

app.get("/cards/:id", async (c) => {
  const { id } = c.req.param();
  const card = cards.find((card) => card.id === parseInt(id as string, 10));
  if (!card) {
    return c.notFound();
  }
  return c.json(card);
});

export default handle(app);
