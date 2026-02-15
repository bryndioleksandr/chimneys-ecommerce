import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user';
import cartReducer from './cart';
import adminProductsReducer from './adminProducts';

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    adminProducts: adminProductsReducer
});

export default rootReducer;
