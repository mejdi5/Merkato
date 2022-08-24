import { createSlice } from "@reduxjs/toolkit";


const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: []
    },
    reducers: {
    getProducts: (state, action) => {
        state.products = action.payload
    }
}})

const { actions, reducer } = productSlice

export const { getProducts } = actions;

export default reducer