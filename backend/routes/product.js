import express from 'express';
import {
    createProduct, getProductBySlug,
    getProducts,
    searchByCategory,
    searchBySubCategory,
    searchBySubSubCategory
} from "../controllers/product.js";

const productRouter = express.Router();

productRouter.get('/products', getProducts);
productRouter.post('/product', createProduct);
productRouter.get('/by-category/:categoryid', searchByCategory);
productRouter.get('/by-subcategory/:subcategoryid', searchBySubCategory);
productRouter.get('/by-subsubcategory/:subsubcategoryid', searchBySubSubCategory);
productRouter.get('/by-slug/:slug', getProductBySlug);


export default productRouter;
