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
    searchProducts,
    updateProduct,
    updateRating,
    updateReviews
} from "../controllers/product.js";
import {verifyToken} from "../middleware/auth.js";
import cookieParser from "cookie-parser";

const productRouter = express.Router();

productRouter.get('/products', cookieParser(), getProducts);
productRouter.post('/product', createProduct);
productRouter.post('/product-clone', cloneProduct);
productRouter.get('/by-category/:categoryid', searchByCategory);
productRouter.get('/by-subcategory/:subcategoryid', searchBySubCategory);
productRouter.get('/by-subsubcategory/:subsubcategoryid', searchBySubSubCategory);
productRouter.get('/by-slug/:slug', getProductBySlug);
productRouter.get('/search', searchProducts);
productRouter.patch('/update-rating/:productId/:rating', updateRating);
productRouter.patch('/update-reviews/:productId', updateReviews);
productRouter.get('/filtered-products', getFilteredProducts);
productRouter.put('/update/:productId', updateProduct);
productRouter.delete('/delete/:productId', deleteProduct);
productRouter.get('/popular', getPopularProducts);
productRouter.get('/for-sale', getHotProducts);
productRouter.get('/newest', getNewestProducts);
productRouter.get('/by-group-id/:groupId', getProductsByGroupId);

productRouter.get('/by-category-paginated/:categoryid', searchByCategoryPaginated);
productRouter.get('/by-subcategory-paginated/:subcategoryid', searchBySubCategoryPaginated);
productRouter.get('/by-subsubcategory-paginated/:subsubcategoryid', searchBySubSubCategoryPaginated);



export default productRouter;
