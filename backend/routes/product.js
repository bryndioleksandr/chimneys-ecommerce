import express from 'express';
import {
    createProduct, deleteProduct, getFilteredProducts, getProductBySlug,
    getProducts,
    searchByCategory,
    searchBySubCategory,
    searchBySubSubCategory, searchProducts, updateProduct, updateRating, updateReviews
} from "../controllers/product.js";

const productRouter = express.Router();

productRouter.get('/products', getProducts);
productRouter.post('/product', createProduct);
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

export default productRouter;
