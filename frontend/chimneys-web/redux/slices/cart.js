import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;

            const quantityToAdd = Number(newItem.quantity) > 0 ? Number(newItem.quantity) : 1;

            const existingItem = state.items.find(item => item._id === newItem._id);

            if (existingItem) {
                existingItem.quantity += quantityToAdd;
            } else {
                state.items.push({ ...newItem, quantity: quantityToAdd });
            }

            state.totalQuantity += quantityToAdd;
            newItem.discountedPrice ? state.totalPrice += newItem.discountedPrice * quantityToAdd : state.totalPrice += newItem.price * quantityToAdd;
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
                item.discountedPrice ? state.totalPrice -= item.discountedPrice * item.quantity : state.totalPrice -= item.price * item.quantity;

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

                item.discountedPrice ? state.totalPrice -= item.discountedPrice * item.quantity : state.totalPrice -= item.price * item.quantity;

                item.quantity = quantity;
                state.totalQuantity += quantity;

                item.discountedPrice ? state.totalPrice += item.discountedPrice * quantity : state.totalPrice += item.price * quantity;

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
        loadCartFromStorage: (state, action) => {
            state.items = action.payload;
            state.totalQuantity = action.payload.reduce((sum, item) => sum + item.quantity, 0);
            state.totalPrice = action.payload.reduce((sum, item) => sum + item.discountedPrice ? item.discountedPrice * item.quantity : item.price * item.quantity, 0);
        },
    },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, loadCartFromStorage } = cartSlice.actions;

export default cartSlice.reducer;
