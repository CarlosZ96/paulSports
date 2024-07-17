import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchMatchesA = createAsyncThunk(
  'america/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://copa-america-2024.p.rapidapi.com/matches', {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'copa-america-2024.p.rapidapi.com',
          'x-rapidapi-key': 'f8c33a76f6msh61f491b42c62ff8p1262e2jsn1f5a4e9a016a'
        }
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    
      const data = await response.json();
      console.log('Partidos Copa America:', data);
    
      if (Array.isArray(data)) {
        data.forEach(match => {
          console.log(`Team A: ${match.teamA?.team?.name}, Team B: ${match.teamB?.team?.name}`);
        });
      } else {
        console.error('Unexpected data format:', data);
      }
    
      console.log('por que');
      return data;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return rejectWithValue(error.message);
    }
  }
);

const AmericaSlice = createSlice({
  name: 'america',
  initialState: {
    matchesa: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchesA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchesA.fulfilled, (state, action) => {
        state.loading = false;
        state.matchesa = action.payload;
      })
      .addCase(fetchMatchesA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default AmericaSlice.reducer;
