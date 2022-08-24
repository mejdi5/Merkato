import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token'), 
        user: null, 
        users: [],
        deliveryGuys: [],
        isLoading: false,
        authError: null
    },
    reducers: {
        load: (state, action) => {
            state.isLoading = action.payload
        },

        getError: (state, action) => {
            state.authError = action.payload
        },

        loginUser: (state, action) => {
            localStorage.setItem('token', action.payload.token);
            state.token = action.payload.token
            state.user = action.payload
        },

        logoutUser: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.user = null
        },

        getAllUsers: (state, action) => {
            state.users = action.payload
        },

        getAllDeliveryGuys: (state, action) => {
            state.deliveryGuys = action.payload
        },

        getCurrentUser: (state, action) => {
            state.user = action.payload
        },
}
})

const { actions, reducer } = userSlice

export const { 
    load,
    getError,
    loginUser,
    logoutUser,
    getAllUsers,
    getAllDeliveryGuys,
    getCurrentUser
} = actions;

export default reducer