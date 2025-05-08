import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('cart')) || []
        : [],
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item._id === newItem._id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }

            state.totalQuantity += newItem.quantity;
            state.totalPrice += newItem.price * newItem.quantity;

            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        },
        removeItemFromCart: (state, action) => {
            const itemToRemove = action.payload;
            const itemIndex = state.items.findIndex(item => item._id === itemToRemove._id);

            if (itemIndex !== -1) {
                const item = state.items[itemIndex];
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;
                state.items.splice(itemIndex, 1);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('cart', JSON.stringify(state.items));
                }
            }
        },
        updateItemQuantity: (state, action) => {
            const { _id, quantity } = action.payload;
            const item = state.items.find(item => item._id === _id);

            if (item) {
                state.totalQuantity -= item.quantity;
                state.totalPrice -= item.price * item.quantity;

                item.quantity = quantity;
                state.totalQuantity += quantity;
                state.totalPrice += item.price * quantity;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('cart', JSON.stringify(state.items));
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;

            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }
        },
    },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
