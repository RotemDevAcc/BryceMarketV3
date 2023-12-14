import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import darkModeReducer from '../features/settings/darkModeSlice';
import cartReducer from '../features/supermarket/cartSlice';
import superReducer from '../features/supermarket/superSlice';
import registerReducer from '../features/login/registerSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    darkMode: darkModeReducer,
    cart: cartReducer,
    super: superReducer,
    register: registerReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
