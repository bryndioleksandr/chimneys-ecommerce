import express from 'express';
import {
    createSubCategory,
    findSubCategoryByName,
    getSubCategories,
    findSubCategoryBySlug,
    searchBySlug, updateSubCategory, removeSubCategory
} from "../controllers/subCategory.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get('/subcategories', getSubCategories);
subCategoryRouter.post('/subcategory', verifyToken, isAdmin, createSubCategory);
subCategoryRouter.get("/search", findSubCategoryByName);
subCategoryRouter.get("/search-slug", findSubCategoryBySlug);
subCategoryRouter.get("/search-slug-one/:slug", searchBySlug);
subCategoryRouter.patch('/update/:id', verifyToken, isAdmin, updateSubCategory);
subCategoryRouter.delete('/:id', verifyToken, isAdmin, removeSubCategory);



export default subCategoryRouter;
