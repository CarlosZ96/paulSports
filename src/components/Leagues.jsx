import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournamentData } from '../redux/Leagues/TournamentDataSlice';
import login from '../img/prosymbols.png';
import '../stylesheets/Leagues.css';

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
                backgroundImage: `url(../img/Premier League.jpg)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues;
