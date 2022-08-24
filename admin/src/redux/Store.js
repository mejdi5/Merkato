import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from './userSlice'
import orderSlice from './orderSlice'
import marketPlaceSlice from './marketPlaceSlice'
import productSlice from './productSlice'
import taxeSlice from './taxeSlice'

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({ 
    userSlice,
    orderSlice,
    marketPlaceSlice,
    productSlice,
    taxeSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export let persistor = persistStore(Store);