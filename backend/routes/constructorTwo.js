import express from 'express';
import {
    createConstructor,
    getConstructor,
    updateConstructorElement,
    deleteConstructorElement, getConstructorElement
} from "../controllers/constructorTwo.js";

const constructorRouter = express.Router();

constructorRouter.post('/constructor', createConstructor);
constructorRouter.get('/constructor/element/:area', getConstructorElement);
constructorRouter.put('/constructor/element', updateConstructorElement);
constructorRouter.delete('/constructor/element/:area', deleteConstructorElement);

export default constructorRouter; 