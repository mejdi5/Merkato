import { createSlice } from "@reduxjs/toolkit";


const taxeSlice = createSlice({
    name: 'taxe',
    initialState: {
        taxes: [],
    },
    reducers: {
    getTaxes: (state, action) => {
        state.taxes = action.payload
    }
}})

const { actions, reducer } = taxeSlice

export const { getTaxes } = actions;

export default reducer