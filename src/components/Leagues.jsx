import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournamentData } from '../redux/Leagues/TournamentDataSlice';
import login from '../img/prosymbols.png';
import '../stylesheets/Leagues.css';

const Leagues = () => {
  const dispatch = useDispatch();
  const { tournaments, loading, error } = useSelector((state) => state.tournament);
  const [backgroundImages, setBackgroundImages] = useState({});

  useEffect(() => {
    dispatch(fetchTournamentData());
  }, [dispatch]);

  useEffect(() => {
    const loadImages = async () => {
      const images = {};
      for (const tournament of tournaments) {
        try {
          const image = await import(`../img/${tournament.name}.jpg`);
          images[tournament.name] = image.default;
        } catch (error) {
          console.error(`Error loading image for ${tournament.name}:`, error);
        }
      }
      setBackgroundImages(images);
    };

    if (tournaments.length) {
      loadImages();
    }
  }, [tournaments]);

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
              <h3>{tournament.name}</h3>
            </div>
          ))}
        </div>
    </div>
  );
};

export default Leagues;
