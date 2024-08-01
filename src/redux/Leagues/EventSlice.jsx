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
      console.log('Datos completos:', data);
      console.log('Eventos:', data.events);

      // Filtrar los eventos para incluir solo aquellos con los nombres de temporada específicos
      const filteredEvents = (data.events || []).filter(event =>
        ["Olympic Games 2024", "Primera A, Clausura 2024", "Olympic Games Women 2024"].includes(event.season?.name)
      );

      // Convertir la fecha en milisegundos y añadir 3 ceros a la derecha, y luego ordenar los eventos por fecha
      const formattedEvents = filteredEvents.map(event => {
        const timestamp = event.startTimestamp * 1000; // Convertir de segundos a milisegundos
        const date = new Date(timestamp);
        event.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        event.timestamp = timestamp; // Guardar el timestamp para ordenar
        return event;
      }).sort((a, b) => a.timestamp - b.timestamp); // Ordenar por fecha

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
        state.matches = [...state.matches, ...action.payload];
      })
      .addCase(FecthEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default EventSlice.reducer;
