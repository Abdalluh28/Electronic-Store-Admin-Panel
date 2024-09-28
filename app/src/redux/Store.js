import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import ordersReducer  from "./slices/ordersSlice";
import productReducer  from "./slices/productSlice";

export const Store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        orders: ordersReducer,
        product: productReducer
    },


    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware);
    },

    devTools: process.env.REACT_APP_NODE_ENV !== 'production',
})


export const StoreActions = Store.actions

setupListeners(Store.dispatch);