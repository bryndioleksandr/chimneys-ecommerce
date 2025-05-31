import express from 'express';
import {getFiltersByCategory} from "../controllers/filters.js";

const filtersRouter = express.Router();
const jsonParser = express.json();

filtersRouter.get('/:id', getFiltersByCategory);

export default filtersRouter;
