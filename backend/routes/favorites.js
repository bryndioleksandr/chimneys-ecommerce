import express from "express";
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorites.js"
import {verifyToken} from "../middleware/auth.js";

const favoritesRouter = express.Router();
const jsonParser = express.json();

favoritesRouter.get("/:userId", verifyToken, getFavorites);
favoritesRouter.post("/:userId", verifyToken, addToFavorites);
favoritesRouter.delete("/:userId/:productId", verifyToken, removeFromFavorites);

export default favoritesRouter;

