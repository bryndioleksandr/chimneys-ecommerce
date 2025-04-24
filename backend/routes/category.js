import express from 'express';
import {createCategory, getCategories, searchByName} from "../controllers/category.js";

const categoryRouter = express.Router();
const jsonParser = express.json();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/category', jsonParser, createCategory);
categoryRouter.get('/by-name/:name', searchByName);

export default categoryRouter;
