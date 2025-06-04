import express from 'express';
import {
    createSubCategory,
    findSubCategoryByName,
    getSubCategories,
    findSubCategoryBySlug,
    searchBySlug
} from "../controllers/subCategory.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get('/subcategories', getSubCategories);
subCategoryRouter.post('/subcategory', createSubCategory);
subCategoryRouter.get("/search", findSubCategoryByName);
subCategoryRouter.get("/search-slug", findSubCategoryBySlug);
subCategoryRouter.get("/search-slug-one/:slug", searchBySlug);


export default subCategoryRouter;
