import express from 'express';
import {
    cloneProduct,
    createProduct,
    deleteProduct,
    getFilteredProducts,
    getHotProducts,
    getNewestProducts,
    getPopularProducts,
    getProductBySlug,
    getProducts, getProductsByGroupId,
    searchByCategory, searchByCategoryPaginated,
    searchBySubCategory, searchBySubCategoryPaginated,
    searchBySubSubCategory, searchBySubSubCategoryPaginated,
    searchProducts, searchProductsInConstructor, updateManyProductsCategories,
    updateProduct,
    updateRating,
    updateReviews
} from "../controllers/product.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";
import cookieParser from "cookie-parser";
import { z } from "zod";
import {validate} from "../middleware/validate.js";

const productRouter = express.Router();

productRouter.get('/products', getProducts);
productRouter.post('/product', verifyToken, isAdmin, createProduct);
productRouter.post('/product-clone', verifyToken, isAdmin, cloneProduct);
productRouter.get('/by-category/:categoryid', searchByCategory);
productRouter.get('/by-subcategory/:subcategoryid', searchBySubCategory);
productRouter.get('/by-subsubcategory/:subsubcategoryid', searchBySubSubCategory);
productRouter.get('/by-slug/:slug', getProductBySlug);
productRouter.get('/search', searchProducts);
productRouter.patch('/update-rating/:productId/:rating', updateRating);
productRouter.patch('/update-reviews/:productId', validate(z.object({ reviews: z.array(z.any()) })), updateReviews);
productRouter.get('/filtered-products', getFilteredProducts);
productRouter.put('/update/:productId', verifyToken, isAdmin, updateProduct);
productRouter.delete('/delete/:productId', verifyToken, isAdmin, deleteProduct);
productRouter.get('/popular', getPopularProducts);
productRouter.get('/for-sale', getHotProducts);
productRouter.get('/newest', getNewestProducts);
productRouter.get('/by-group-id/:groupId', getProductsByGroupId);

productRouter.get('/by-category-paginated/:categoryid', searchByCategoryPaginated);
productRouter.get('/by-subcategory-paginated/:subcategoryid', searchBySubCategoryPaginated);
productRouter.get('/by-subsubcategory-paginated/:subsubcategoryid', searchBySubSubCategoryPaginated);
productRouter.get('/search-constructor', searchProductsInConstructor);
productRouter.put('/update-categories', updateManyProductsCategories);




export default productRouter;
