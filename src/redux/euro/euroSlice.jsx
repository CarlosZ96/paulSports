import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchMatches = createAsyncThunk(
  'euro/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://euro-20242.p.rapidapi.com/matches', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'euro-20242.p.rapidapi.com',
          'x-rapidapi-key': 'f8c33a76f6msh61f491b42c62ff8p1262e2jsn1f5a4e9a016a'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Partidos:');
      data.forEach(match => {
        console.log(`Team A: ${match.teamA.team.name}, Team B: ${match.teamB.team.name}`);
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const euroSlice = createSlice({
  name: 'euro',
  initialState: {
    matches: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default euroSlice.reducer;
