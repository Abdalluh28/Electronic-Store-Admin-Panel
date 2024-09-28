import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    productFlag: false,
}


const productSlice = createSlice({
    initialState,
    name: 'product',
    reducers: {
        setProductFlag: (state, action) => {
            state.productFlag = action.payload
        },
    }
})


export const { setProductFlag } = productSlice.actions
export default productSlice.reducer