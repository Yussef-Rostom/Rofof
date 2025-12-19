import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { CartItem, CartState } from "@/types";

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  status: "idle",
  error: null,
  loadingItemId: null,
};

const calculateCartTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce(
    (total, item) => total + item.listing.price * item.quantity,
    0
  );
  return { totalQuantity, totalAmount };
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await api.get("/cart");
  return response.data;
});

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (item: { listingId: string; quantity: number }, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };

      const existingCartItem = state.cart.items.find(
        (cartItem) => {
          const currentListingId = typeof cartItem.listing === 'object' ? cartItem.listing._id : cartItem.listing;
          return currentListingId === item.listingId;
        }
      );

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + item.quantity;
        const response = await api.put(`/cart/${existingCartItem._id}`, {
          quantity: newQuantity,
        }, { skipGlobalErrorHandler: true } as any);
        return response.data;
      } else {
        const response = await api.post("/cart", {
          listingId: item.listingId,
          quantity: item.quantity,
        }, { skipGlobalErrorHandler: true } as any);
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || "Failed to add item to cart");
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (itemId: string) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (item: { itemId: string; quantity: number }) => {
    const response = await api.put(`/cart/${item.itemId}`, {
      quantity: item.quantity,
    });
    return response.data;
  }
);

export const clearCartAsync = createAsyncThunk("cart/clearCart", async () => {
  await api.delete("/cart");
  return {};
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        const { totalQuantity, totalAmount } = calculateCartTotals(
          action.payload.items
        );
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addItemToCart.pending, (state, action) => {
        state.status = "loading";
        state.loadingItemId = action.meta.arg.listingId;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loadingItemId = null;
        state.items = action.payload.items;
        const { totalQuantity, totalAmount } = calculateCartTotals(
          action.payload.items
        );
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "failed";
        state.loadingItemId = null;
        state.error = (action.payload as string) || action.error.message || "Failed to add item to cart";
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        const { totalQuantity, totalAmount } = calculateCartTotals(
          action.payload.items
        );
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        const { totalQuantity, totalAmount } = calculateCartTotals(
          action.payload.items
        );
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
        state.status = "succeeded";
      })
      .addCase(clearCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to clear cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
