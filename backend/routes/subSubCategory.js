import express from 'express';
import { createSubSubCategory, getSubSubCategories } from "../controllers/subSubCategory.js";

const subSubCategoryRouter = express.Router();

subSubCategoryRouter.get('/subsubcategories', getSubSubCategories);
subSubCategoryRouter.post('/subsubcategory', createSubSubCategory);

export default subSubCategoryRouter;
