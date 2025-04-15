import express from 'express';
import {createSubSubCategory, findSubSubCategoryByName, getSubSubCategories} from "../controllers/subSubCategory.js";

const subSubCategoryRouter = express.Router();

subSubCategoryRouter.get('/subsubcategories', getSubSubCategories);
subSubCategoryRouter.post('/subsubcategory', createSubSubCategory);
subSubCategoryRouter.get("/search", findSubSubCategoryByName);

export default subSubCategoryRouter;
