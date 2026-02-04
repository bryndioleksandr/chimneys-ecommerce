import express from 'express';
import {
    createSubSubCategory,
    findSubSubCategoryByName,
    findSubSubCategoryBySlug,
    getSubSubCategories, removeSubSubCategory, searchBySlug, updateSubSubCategory
} from "../controllers/subSubCategory.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";

const subSubCategoryRouter = express.Router();

subSubCategoryRouter.get('/subsubcategories', getSubSubCategories);
subSubCategoryRouter.post('/subsubcategory', verifyToken, isAdmin, createSubSubCategory);
subSubCategoryRouter.get("/search", findSubSubCategoryByName);
subSubCategoryRouter.get("/search-all", findSubSubCategoryBySlug);
subSubCategoryRouter.get("/search-one", searchBySlug);
subSubCategoryRouter.patch('/update/:id', verifyToken, isAdmin, updateSubSubCategory);
subSubCategoryRouter.delete('/:id', verifyToken, isAdmin, removeSubSubCategory)


export default subSubCategoryRouter;
