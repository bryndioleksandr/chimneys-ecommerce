import express from "express";
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorites.js"

const favoritesRouter = express.Router();
const jsonParser = express.json();

favoritesRouter.get("/:userId", getFavorites);
favoritesRouter.post("/:userId", addToFavorites);
favoritesRouter.delete("/:userId/:productId", removeFromFavorites);

export default favoritesRouter;

