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
import constructorRouter from "./constructorOne.js";
import constructorTwoRouter from "./constructorTwo.js";
import infoRouter from "./infoPage.js";
import exchangeRouter from "./dataExchange.js";
import debugRouter from "./debug.js";
import {resetUserPassword, updatePassword} from "../controllers/user.js";
import Product from "../models/product.js";

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
router.use('/constructor-one', constructorRouter);
router.use('/constructor-two', constructorTwoRouter);
router.use('/info-page', infoRouter);
router.use('/data-exchange', exchangeRouter);
router.get('/health', (req, res) => {
    res.status(200).send('Server is alive');
});
router.use('/debug', debugRouter);
router.post('/forgot-password', resetUserPassword);
router.post('/reset-password/:token', updatePassword);
// router.post('/normalize-products', async (req, res) => {
//     try {
//         const products = await Product.find({});
//         let updatedCount = 0;
//
//         const bulkOps = [];
//
//         products.forEach((product) => {
//             let originalName = product.name;
//             let newName = originalName;
//
//             newName = newName.replace(/(\d+),(\d+)/g, '$1.$2');
//
//             newName = newName.replace(/(\d+(?:\.\d+)?)\s*[мМ](?!\w)/g, '$1м');
//
//             newName = newName.replace(/[фФfF]\s*(\d+)/g, 'Ф$1');
//
//             newName = newName.replace(/\s+/g, ' ').trim();
//
//             newName = newName.replace(/(45|87|90)\*(?!\d)/g, '$1°');
//             if (originalName !== newName) {
//                 bulkOps.push({
//                     updateOne: {
//                         filter: { _id: product._id },
//                         update: { $set: { name: newName } }
//                     }
//                 });
//                 updatedCount++;
//             }
//         });
//
//         if (bulkOps.length > 0) {
//             await Product.bulkWrite(bulkOps);
//         }
//
//         res.status(200).json({
//             message: "Нормалізацію завершено успішно",
//             totalChecked: products.length,
//             updatedProducts: updatedCount
//         });
//
//     } catch (error) {
//         console.error("Помилка нормалізації:", error);
//         res.status(500).json({ message: "Помилка сервера при нормалізації" });
//     }
// })

export default router;
