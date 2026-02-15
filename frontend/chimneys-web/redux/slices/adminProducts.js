import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    productIds: []
};

const adminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {
        toggleProductSelection: (state, action) => {
            const id = action.payload;
            if (state.productIds.includes(id)) {
                state.productIds = state.productIds.filter((itemId) => itemId !== id);
            } else {
                state.productIds.push(id);
            }
        },
        clearProductSelection: (state) => {
            state.productIds = [];
        }
    }
})

export const {
    toggleProductSelection,
    clearProductSelection
} = adminProductsSlice.actions;

export default adminProductsSlice.reducer;
