import express from 'express';
import { createSubCategory, findSubCategoryByName, getSubCategories, findSubCategoryBySlug } from "../controllers/subCategory.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get('/subcategories', getSubCategories);
subCategoryRouter.post('/subcategory', createSubCategory);
subCategoryRouter.get("/search", findSubCategoryByName);
subCategoryRouter.get("/search-slug", findSubCategoryBySlug);

export default subCategoryRouter;
