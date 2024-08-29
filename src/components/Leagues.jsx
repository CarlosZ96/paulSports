import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournamentData } from '../redux/Leagues/TournamentDataSlice';
import login from '../img/prosymbols.png';
import '../stylesheets/Leagues.css';

// Importa las imágenes
import copaLibertadores from '../img/CONMEBOL Libertadores.jpg';
import primeraA from '../img/Primera A, Clausura.jpg';
import premierLeague from '../img/Premier League.jpg';

// Crea un objeto de mapeo con rutas completas
const tournamentImages = {
  "Copa Libertadores 2024": copaLibertadores,
  "Primera A, Clausura 2024": primeraA,
  "Premier League": premierLeague
};

const Leagues = () => {
  const dispatch = useDispatch();
  const { tournaments, loading, error } = useSelector((state) => state.tournament);

  useEffect(() => {
    dispatch(fetchTournamentData());
  }, [dispatch]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='Leagues-popup-window'>
      <div className='Login-Container'>
        <img className='login-img' src={login} alt="" />
        <h2 className='login-txt'>Login/Register</h2>
      </div>

      <div className='Leagues-container'>
        {tournaments.map((tournament) => (
          <div className='teams-container' key={tournament.id}>
            <img src={tournament.imageUrl} alt={tournament.name} className='tournament-img' />
            <div
              className='tournament-background-img'
              style={{
                backgroundImage: `url(${tournamentImages[tournament.name] || ''})`,
              }}
            />
            <h3>{tournament.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues;
