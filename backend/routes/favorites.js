import express from "express";
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorites.js"
import {verifyToken} from "../middleware/auth.js";
import {favoriteSchema} from "../utils/validation.js";
import {validate} from "../middleware/validate.js";

const favoritesRouter = express.Router();
const jsonParser = express.json();

favoritesRouter.get("/:userId", verifyToken, getFavorites);
favoritesRouter.post("/:userId", verifyToken, validate(favoriteSchema), addToFavorites);
favoritesRouter.delete("/:userId/:productId", verifyToken, removeFromFavorites);

export default favoritesRouter;

