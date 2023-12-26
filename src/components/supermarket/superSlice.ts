import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from './superAPI';
import { buyCart } from './superAPI';
import { Message } from '../../Message';
import { clearCart } from './cartSlice';


export interface SProductDetails {
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


export interface SuperInterface {
    products:SProductDetails[],
    status: string,
    categories:SCategoryDetails[]
}


interface RootState {
    super: SuperInterface;
    // ... other reducers or slices
}

const initialState:SuperInterface = {
  products:[],
  status:"",
  categories:[]
};

export const getDataAsync = createAsyncThunk(
    'super/fetchProducts',
    async () => {
      const response = await fetchProducts();
      return response.data;
    }
);

export const purchaseCartAsync = createAsyncThunk(
  'super/purchaseCart',
   async(details:{cart:SProductDetails[],price:number,token:string}) => {
    const response = await buyCart(details);
    clearCart()
    return response.data;
   }
);



export const superSlice = createSlice({
  name: 'super',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // purchaseCart:(state,payload)=>{
    //   const pl = payload.payload
    //   const cart = pl.cart
    //   const token = pl.token
    //   const price = pl.price
    //   const data = {
    //     "cart":cart,
    //     "token":token,
    //     "price":price
    //   }
    //   const result = buyCart(data)
    // },


    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.fulfilled, (state, action) => {
        state.products =action.payload.products
        state.categories = action.payload.categories
        state.status ='done'
      })
      .addCase(getDataAsync.rejected, (state, action) => {
        state.status ='rejected'
      })
      .addCase(getDataAsync.pending, (state, action) => {
        state.status = "loading";
      })

      .addCase(purchaseCartAsync.fulfilled, (state,action) => {
        Message("Cart Purchased Successfully","success")
      })
  },
  
});

// export const { purchaseCart } = superSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.super.value)`
export const selectproducts = (state: RootState) => state.super.products;
export const selectcategories = (state: RootState) => state.super.categories;
export const selectstatus = (state: RootState) => state.super.status;
export default superSlice.reducer;
