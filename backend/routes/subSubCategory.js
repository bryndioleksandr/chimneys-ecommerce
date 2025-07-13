import express from 'express';
import {
    createSubSubCategory,
    findSubSubCategoryByName,
    findSubSubCategoryBySlug,
    getSubSubCategories, removeSubSubCategory, searchBySlug, updateSubSubCategory
} from "../controllers/subSubCategory.js";

const subSubCategoryRouter = express.Router();

subSubCategoryRouter.get('/subsubcategories', getSubSubCategories);
subSubCategoryRouter.post('/subsubcategory', createSubSubCategory);
subSubCategoryRouter.get("/search", findSubSubCategoryByName);
subSubCategoryRouter.get("/search-all", findSubSubCategoryBySlug);
subSubCategoryRouter.get("/search-one", searchBySlug);
subSubCategoryRouter.patch('/update/:id', updateSubSubCategory);
subSubCategoryRouter.delete('/:id', removeSubSubCategory)


export default subSubCategoryRouter;
