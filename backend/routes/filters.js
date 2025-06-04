import express from 'express';
import {getFiltersByCategory} from "../controllers/filters.js";

const filtersRouter = express.Router();
const jsonParser = express.json();

filtersRouter.get('/:categoryId/:subCategoryId?/:subSubCategoryId?', getFiltersByCategory);

export default filtersRouter;
