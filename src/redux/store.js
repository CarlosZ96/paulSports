import { configureStore } from '@reduxjs/toolkit';
import leagues from './leagues/leagueSlice';

const rootReducer = {
  leagues: leagues,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;