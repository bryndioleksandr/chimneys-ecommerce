import express from 'express';
import {
    createSubSubCategory,
    findSubSubCategoryByName,
    findSubSubCategoryBySlug,
    getSubSubCategories, searchBySlug
} from "../controllers/subSubCategory.js";

const subSubCategoryRouter = express.Router();

subSubCategoryRouter.get('/subsubcategories', getSubSubCategories);
subSubCategoryRouter.post('/subsubcategory', createSubSubCategory);
subSubCategoryRouter.get("/search", findSubSubCategoryByName);
subSubCategoryRouter.get("/search-all", findSubSubCategoryBySlug);
subSubCategoryRouter.get("/search-one", searchBySlug);


export default subSubCategoryRouter;
