import { configureStore } from '@reduxjs/toolkit';
import euro from './euro/euroSlice';
import america from './euro/AmericaSlice';

const rootReducer = {
  euro: euro,
  america: america
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;