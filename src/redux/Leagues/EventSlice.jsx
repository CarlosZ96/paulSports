import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const FecthEvents = createAsyncThunk(
  'Leagues/FecthEvents',
  async (date, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://allsportsapi2.p.rapidapi.com/api/matches/${date}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
          'x-rapidapi-key': '5b8ad83598mshfe0b05159a9aaa8p1cbc63jsn991e0f990061'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Datos completos:', data);
      console.log('Eventos:', data.events);
      return data.events || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const EventSlice = createSlice({
  name: 'matches',
  initialState: {
    matches: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FecthEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FecthEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = [...state.matches, ...action.payload];
      })
      .addCase(FecthEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default EventSlice.reducer;
