import express from 'express';
import { createSubCategory, getSubCategories } from "../controllers/subCategory.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get('/subcategories', getSubCategories);
subCategoryRouter.post('/subcategory', createSubCategory);

export default subCategoryRouter;
