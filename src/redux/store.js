import { configureStore } from '@reduxjs/toolkit';
import euro from './euro/euroSlice';
import america from './euro/AmericaSlice';
import maches from './Leagues/EventSlice';
import tournament from './Leagues/TournamentDataSlice';

const rootReducer = {
  euro: euro,
  america: america,
  maches: maches,
  tournament: tournament,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
