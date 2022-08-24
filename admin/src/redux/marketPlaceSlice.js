import { createSlice } from "@reduxjs/toolkit";


const marketPlaceSlice = createSlice({
    name: 'market place',
    initialState: {
        marketPlaces: []
    },
    reducers: {
    getMarketPlaces: (state, action) => {
        state.marketPlaces = action.payload
    }
}})

const { actions, reducer } = marketPlaceSlice

export const { getMarketPlaces } = actions;

export default reducer