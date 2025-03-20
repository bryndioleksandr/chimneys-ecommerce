import express from 'express';
import { createProduct, getProducts } from "../controllers/product.js";

const productRouter = express.Router();

productRouter.get('/products', getProducts);
productRouter.post('/product', createProduct);

export default productRouter;
