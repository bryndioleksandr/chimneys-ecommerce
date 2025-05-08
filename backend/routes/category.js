import express from 'express';
import {createCategory, getCategories, searchByName, searchBySlug} from "../controllers/category.js";

const categoryRouter = express.Router();
const jsonParser = express.json();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/category', jsonParser, createCategory);
categoryRouter.get('/by-name/:name', searchByName);
categoryRouter.get('/by-slug/:slug', searchBySlug);

export default categoryRouter;
