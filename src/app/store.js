// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import { loadState, saveState } from '../utils/localStorage';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});
