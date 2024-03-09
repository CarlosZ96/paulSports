import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLeagues = createAsyncThunk(
  'Games/getLeagues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://api.football-data.org/v4/competitions/', {
      'mode': 'no-cors',   
      headers: {
          'X-Auth-Token': 'af64fe66266d44669441ef1252e4bed4'
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return rejectWithValue(error.message);
    }
  }
);

const leagueSlice = createSlice({
  name: 'games',
  initialState: {
    Leagues: [],
    status: 'idle',
    error: null
  },
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeagues.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLeagues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Leagues = action.payload; // Corrección de typo aquí
      })
      .addCase(getLeagues.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { response } = leagueSlice.actions;
export default leagueSlice.reducer;

