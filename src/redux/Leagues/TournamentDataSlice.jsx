// Redux slice: TournamentDataSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchTournamentData = createAsyncThunk(
  'tournament/fetchTournamentData',
  async (_, { rejectWithValue }) => {
    const tournamentIds = [11536, 480, 384, 17];
    try {
      const tournamentDataRequests = tournamentIds.map(async (id) => {
        // Fetch tournament data
        const tournamentResponse = await fetch(`https://allsportsapi2.p.rapidapi.com/api/tournament/${id}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
            'x-rapidapi-key': 'f8c33a76f6msh61f491b42c62ff8p1262e2jsn1f5a4e9a016a',
          },
        });
        const tournamentData = await tournamentResponse.json();

        // Fetch image for the tournament
        const imageResponse = await fetch(`https://allsportsapi2.p.rapidapi.com/api/tournament/${id}/image`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
            'x-rapidapi-key': 'f8c33a76f6msh61f491b42c62ff8p1262e2jsn1f5a4e9a016a',
          },
        });
        const blob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Combine data
        return {
          id,
          name: tournamentData.uniqueTournament.name,
          imageUrl,
        };
      });

      const tournamentData = await Promise.all(tournamentDataRequests);
      return tournamentData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState: {
    tournaments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTournamentData.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload;
      })
      .addCase(fetchTournamentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tournamentSlice.reducer;
