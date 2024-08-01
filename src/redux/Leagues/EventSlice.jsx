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

      const filteredEvents = (data.events || []).filter(event =>
        ["Olympic Games 2024", "Primera A, Clausura 2024", "Olympic Games Women 2024"].includes(event.season?.name)
      );

      const formattedEvents = await Promise.all(filteredEvents.map(async event => {
        const timestamp = event.startTimestamp * 1000;
        const date = new Date(timestamp);
        event.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        event.timestamp = timestamp;

        const homeTeamResponse = await fetch(`https://allsportsapi2.p.rapidapi.com/api/team/${event.homeTeam.id}/image`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
            'x-rapidapi-key': 'b57976ae53mshaea78024d356c56p15fa93jsn121fe3bd4f98'
          }
        });
        const homeTeamBlob = await homeTeamResponse.blob();
        const homeTeamImageUrl = URL.createObjectURL(homeTeamBlob);
        event.homeTeam.image = homeTeamImageUrl;

        const awayTeamResponse = await fetch(`https://allsportsapi2.p.rapidapi.com/api/team/${event.awayTeam.id}/image`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
            'x-rapidapi-key': 'b57976ae53mshaea78024d356c56p15fa93jsn121fe3bd4f98'
          }
        });
        const awayTeamBlob = await awayTeamResponse.blob();
        const awayTeamImageUrl = URL.createObjectURL(awayTeamBlob);
        event.awayTeam.image = awayTeamImageUrl;

        const tournament = await fetch(`https://allsportsapi2.p.rapidapi.com/api/tournament/${event.tournament.uniqueTournament.id}/image`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'allsportsapi2.p.rapidapi.com',
            'x-rapidapi-key': '5b8ad83598mshfe0b05159a9aaa8p1cbc63jsn991e0f990061'
          }
        });
        const tournamentBlob = await tournament.blob();
        const tournamentUrl = URL.createObjectURL(tournamentBlob);
        event.tournament.image = tournamentUrl;

        return event;
      }));

      formattedEvents.sort((a, b) => a.timestamp - b.timestamp);

      return formattedEvents;
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
        // Evita añadir duplicados
        const newMatches = action.payload.filter(
          newMatch => !state.matches.some(match => match.id === newMatch.id)
        );
        state.matches = [...state.matches, ...newMatches];
      })
      .addCase(FecthEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default EventSlice.reducer;
