import express from 'express';
import { createCategory, getCategories } from "../controllers/category.js";

const categoryRouter = express.Router();
const jsonParser = express.json();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/category', jsonParser, createCategory);

export default categoryRouter;
