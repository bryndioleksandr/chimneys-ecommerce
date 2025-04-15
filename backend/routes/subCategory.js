import express from 'express';
import {createSubCategory, findSubCategoryByName, getSubCategories} from "../controllers/subCategory.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get('/subcategories', getSubCategories);
subCategoryRouter.post('/subcategory', createSubCategory);
subCategoryRouter.get("/search", findSubCategoryByName);

export default subCategoryRouter;
