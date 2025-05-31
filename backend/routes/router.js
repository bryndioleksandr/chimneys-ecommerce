import express from 'express';
import productRouter from './product.js';
import categoryRouter from "./category.js";
import subCategoryRouter from "./subCategory.js";
import subSubCategoryRouter from "./subSubCategory.js";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import orderRouter from "./order.js";
import filtersRouter from "./filters.js";

const router = express.Router();
const jsonParser = express.json();

router.use('/products',  productRouter);
router.use('/category', categoryRouter);
router.use('/subcategory', subCategoryRouter);
router.use('/subsubcategory', subSubCategoryRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/order', orderRouter);
router.use('/filters', filtersRouter);

export default router;
