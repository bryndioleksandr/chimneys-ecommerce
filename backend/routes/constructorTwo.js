import express from 'express';
import {
    createConstructor,
    getConstructor,
    updateConstructorElement,
    deleteConstructorElement, getConstructorElement
} from "../controllers/constructorTwo.js";
import {isAdmin, verifyToken} from "../middleware/auth.js";

const constructorRouter = express.Router();

constructorRouter.post('/constructor', createConstructor);
constructorRouter.get('/constructor/element/:area', getConstructorElement);
constructorRouter.put('/constructor/element', verifyToken, isAdmin, updateConstructorElement);
constructorRouter.delete('/constructor/element/:area', verifyToken, isAdmin, deleteConstructorElement);

export default constructorRouter;
