import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const FecthEvents = createAsyncThunk(
  'Leagues/FecthEvents',
  async (date, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://allsportsapi2.p.rapidapi.com/api/matches/${date}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
          'x-rapidapi-key': 'f8c33a76f6msh61f491b42c62ff8p1262e2jsn1f5a4e9a016a'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Sin filtro:',data.events[0]);
      const filteredMatches = data.events.filter(match => match.season.name === "UEFA Europa League 24/25");

      console.log('Filtered Matches:');
      console.log(filteredMatches);

      return filteredMatches;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const EventSlice = createSlice({
  name: 'euro',
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
        state.matches = action.payload;
      })
      .addCase(FecthEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default EventSlice.reducer;
