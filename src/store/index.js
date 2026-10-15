import { configureStore } from '@reduxjs/toolkit';
import sleepReducer from './sleepSlice';

export const store = configureStore({
  reducer: {
    sleep: sleepReducer,
  },
});
