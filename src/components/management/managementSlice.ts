import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addAdminCategory, addAdminProducts, admin_removeuser, editAdminProducts, editAdminStaff, getAllCustomers, getAllProducts, removeAdminProducts } from './managementAPI';
import { Message } from '../../Message';


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

export interface CustomersDetails {
    id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    date_of_birth: string;
    gender: string;
    img: string;
    is_staff: boolean
}

export interface ManagementINT {
    status: string;
    products: AllProductDetails[];
    categories: SCategoryDetails[];
    customers: CustomersDetails[];
}


interface RootState {
    management: ManagementINT;
    // ... other reducers or slices
}

const initialState: ManagementINT = {
    products: [],
    categories: [],
    customers: [],
    status: "",
};



// Products
export const getAdminProductsAsync = createAsyncThunk(
    'management/getAllProducts',
    async (token: string) => {
        const response = await getAllProducts(token);
        return response.data;
    }
);

export const addAdminCategoryAsync = createAsyncThunk(
    'management/addAdminCategory',
    async (details: { formData: FormData, token: string }) => {
        const response = await addAdminCategory(details);
        return response.data;
    }
);

export const addAdminProductsAsync = createAsyncThunk(
    'management/addAdminProducts',
    async (details: { formData: FormData, token: string }) => {
        const response = await addAdminProducts(details);
        return response.data;
    }
);


export const editAdminProductsAsync = createAsyncThunk(
    'management/editAdminProducts',
    async (details: { formData: FormData, token: string, productid: number }) => {
        const response = await editAdminProducts(details);
        return response.data;
    }
);

export const removeAdminProductsAsync = createAsyncThunk(
    'management/removeAdminProducts',
    async (details: { productid: number, token: string }) => {
        const response = await removeAdminProducts(details);
        return response.data;
    }
);
// End Products

// Customers
export const getAdminCustomersAsync = createAsyncThunk(
    'management/getAllCustomers',
    async (token: string) => {
        const response = await getAllCustomers(token);
        return response.data;
    }
);

export const editAdminStaffAsync = createAsyncThunk(
    'management/editAdminStaff',
    async (details: { userid: number, set: boolean, token: string }) => {
        const response = await editAdminStaff(details);
        return response.data;
    }
);

export const AdminremoveUserAsync = createAsyncThunk(
    'management/admin_removeuser',
    async (details: { userid: number, token: string }) => {
        const response = await admin_removeuser(details);
        return response.data;
    }
);

// End Customers





export const managementSlice = createSlice({
    name: 'management',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        updateStatus: (state, action) => {
            const payload = action.payload
            if (payload) {
                if (typeof (payload) == "string") state.status = payload

                // console.log("Set To "+payload)
            }
        },



    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminProductsAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload.state === "error") {
                    Message(payload.message, payload.state)
                    state.status = 'failed'
                    return
                }

                const prods = payload.products
                const cats = payload.categories
                if (cats && prods) {
                    state.status = 'done'
                    state.products = prods
                    state.categories = cats
                } else {
                    state.status = 'failed'
                }


            })
            .addCase(getAdminProductsAsync.rejected, (state, action) => {
                state.status = 'rejected'
            })
            .addCase(getAdminProductsAsync.pending, (state, action) => {
                state.status = "loading";
            })

            .addCase(addAdminCategoryAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload.state === "error") {
                    Message(payload.message, payload.state)
                    state.status = 'failed'
                    return
                }
                const newCategory = payload.category;
                if (newCategory) { state.categories.push(newCategory) } else {
                    Message("ERROR, we couldn't refresh the page.", "error")
                }

            })

            .addCase(addAdminProductsAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload.state === "error") {
                    Message(payload.message, payload.state)
                    state.status = 'failed'
                    return
                }
                const newProduct = payload.product;
                state.products.push(newProduct)
                Message(`Product ${newProduct.id} - ${newProduct.name} Added Successfully`, "success")
            })

            .addCase(editAdminProductsAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload.state === "error") {
                    Message(payload.message, payload.state)
                    state.status = 'failed'
                    return
                }
                const updatedProduct = payload.product;

                // Use map to create a new array with the updated product
                state.products = state.products.map(product => {
                    if (product.id === updatedProduct.id) {
                        // Replace the old product with the updated one
                        Message(`Product ${product.id} Edited Successfully`, "success")
                        return updatedProduct;
                    }
                    // Keep other products unchanged
                    return product;
                });
            })
            .addCase(removeAdminProductsAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload.state === "error") {
                    Message(payload.message, payload.state)
                    state.status = 'failed'
                    return
                }
                if (payload.success) {
                    Message(payload.message, "success")
                    const rproduct = payload.product
                    if (rproduct) {
                        state.products = state.products.filter(prod => prod.id !== rproduct)
                    }

                } else {
                    Message(payload.message, "error")
                }
            })

            .addCase(getAdminCustomersAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload) {
                    console.log(payload)
                    state.customers = payload
                    state.status = 'done'
                } else {
                    state.status = 'failed'
                }
            })

            .addCase(editAdminStaffAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload) {
                    if (payload.success) {
                        Message(payload.message, "success")
                        const updatedUser = payload.customer;
                        state.customers = state.customers.map(customer => {
                            if (customer.id === updatedUser.id) {
                                Message(`User ${customer.id} Edited Successfully`, "success")
                                return updatedUser;
                            }
                            // Keep other products unchanged
                            return customer;
                        });
                    } else {
                        Message(payload.message, "error")
                    }
                } else {
                    Message("Set Staff Failed", "error")
                }
            })

            .addCase(editAdminStaffAsync.rejected, (state,action) => {
                Message("Set Staff Failed", "error")
            })
            .addCase(AdminremoveUserAsync.fulfilled, (state, action) => {
                const payload = action.payload
                if (payload.state === "error") {
                    Message(payload.message, payload.state)
                    // state.status = 'failed'
                    return
                }
                if (payload.success) {
                    Message(payload.message, "success")
                    const rcustomer = payload.customer
                    if (rcustomer) {
                        console.log(rcustomer)
                        state.customers = state.customers.filter(customer => customer.id !== rcustomer.id)
                    }

                } else {
                    Message(payload.message, "error")
                }
            })

            .addCase(AdminremoveUserAsync.rejected, (state,action) => {
                Message("Remove User Failed", "error")
            })
    },

});

export const { updateStatus } = managementSlice.actions;
export const selectastatus = (state: { management: { status: string; }; }) => state.management.status;
export const get_admin_products = (state: RootState) => state.management.products
export const get_admin_categories = (state: RootState) => state.management.categories
export const get_admin_customers = (state: RootState) => state.management.customers

export default managementSlice.reducer;