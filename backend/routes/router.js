import express from 'express';
import productRouter from './product.js';
import categoryRouter from "./category.js";
import subCategoryRouter from "./subCategory.js";
import subSubCategoryRouter from "./subSubCategory.js";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import orderRouter from "./order.js";
import filtersRouter from "./filters.js";
import reviewRouter from "./review.js";
import favoritesRouter from "./favorites.js";
import liqpayRouter from "./payment.js";
import {verifyEmail} from "../controllers/verifyEmail.js";
import bannerRouter from "./banner.js";

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
router.use('/reviews', reviewRouter);
router.use('/favorites', favoritesRouter);
router.post('/verify-email', verifyEmail);
router.use('/liqpay', liqpayRouter);
router.use('/banner', bannerRouter);


export default router;
