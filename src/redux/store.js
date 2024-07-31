import { configureStore } from '@reduxjs/toolkit';
import euro from './euro/euroSlice';
import america from './euro/AmericaSlice';
import maches from './Leagues/EventSlice';

const rootReducer = {
  euro: euro,
  america: america,
  maches: maches
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;