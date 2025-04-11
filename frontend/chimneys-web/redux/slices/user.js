import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('user')) || null
        : null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        dispUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
})

export default userSlice.reducer;
export const { dispUser, logout} = userSlice.actions;
