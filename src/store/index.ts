import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import accountReducer from './accountSlice';
import listingReducer from './listingSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    account: accountReducer,
    listing: listingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
