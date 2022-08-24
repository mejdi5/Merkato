import { createSlice } from "@reduxjs/toolkit";


const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        orders: []
    },
    reducers: {
    getOrder: (state, action) => {
        state.order = action.payload
    },
    getOrders: (state, action) => {
        state.orders = action.payload
    }
}})

const { actions, reducer } = orderSlice

export const { getOrder, getOrders } = actions;

export default reducer