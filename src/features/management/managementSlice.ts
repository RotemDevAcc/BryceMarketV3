import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllProducts } from './managementAPI';


export interface AllProductDetails {
    id: number;
    category: number;
    name: string;
    desc: string;
    price: number;
    img: string;
    count: number
}

export interface SCategoryDetails {
    id: number;
    desc: string;
}

export interface ManagementINT {
    status: string;
    products: AllProductDetails[];
    categories: SCategoryDetails[];
}


interface RootState {
    management: ManagementINT;
    // ... other reducers or slices
}

const initialState: ManagementINT = {
    products:[],
    categories:[],
    status: "",
};


export const getAdminProductsAsync = createAsyncThunk(
    'management/getAllProducts',
    async (token:string) => {
        const response = await getAllProducts(token);
        return response.data;
    }
);


export const managementSlice = createSlice({
    name: 'management',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        doSmth: (state, payload) => {

        },



    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminProductsAsync.fulfilled, (state, action) => {
                const payload = action.payload
                const prods = payload.products
                const cats = payload.categories
                if(cats && prods){
                    state.status = 'done'
                    state.products = prods
                    state.categories = cats
                }else{
                    state.status = 'failed'
                }
                
                
            })
            .addCase(getAdminProductsAsync.rejected, (state, action) => {
                state.status = 'rejected'
            })
            .addCase(getAdminProductsAsync.pending, (state, action) => {
                state.status = "loading";
            })
    },

});

export const { doSmth } = managementSlice.actions;
export const selectastatus = (state: { management: { status: string; }; }) => state.management.status;
export const get_admin_products = (state: RootState) => state.management.products
export const get_admin_categories = (state: RootState) => state.management.categories

export default managementSlice.reducer;