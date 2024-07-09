import { configureStore } from '@reduxjs/toolkit';
import euro from './euro/euroSlice';

const rootReducer = {
  euro: euro,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;