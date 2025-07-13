import express from 'express';
import cookieParser from 'cookie-parser';
import {
    createCategory,
    getCategories,
    removeCategory,
    searchByName,
    searchBySlug,
    updateCategory
} from "../controllers/category.js";
import {verifyToken} from "../middleware/auth.js";

const categoryRouter = express.Router();
const jsonParser = express.json();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/category', jsonParser, createCategory);
categoryRouter.get('/by-name/:name', searchByName);
categoryRouter.get('/by-slug/:slug', searchBySlug);
categoryRouter.patch('/update/:id', updateCategory);
categoryRouter.delete('/:id', removeCategory);

export default categoryRouter;
