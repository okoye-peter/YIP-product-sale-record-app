import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
  quantityToWarn: number;
  image: string;
  createdAt: number;
}

interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      if (state.items.length < 5) {
        state.items.unshift(action.payload);
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    recordSale: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const product = state.items.find((p) => p.id === action.productId);
      if (product) {
        const currentQty = Number(product.quantity);
        const sellQty = Number(action.quantity);
        if (currentQty >= sellQty) {
          product.quantity = currentQty - sellQty;
        }
      }
    },
  },
});

export const { addProduct, removeProduct, recordSale, setProducts } = productSlice.actions;
export default productSlice.reducer;
