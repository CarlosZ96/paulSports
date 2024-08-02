import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../stylesheets/MainPages.css';
import paul from '../img/paul.png';
import ball from '../img/ball.png';
import { FecthEvents } from '../redux/Leagues/EventSlice';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function MainPage() {
  const dispatch = useDispatch();
  const { matches, loading, error } = useSelector((state) => state.maches);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'USER_LOGGED_IN', payload: user });
      } else {
        dispatch({ type: 'USER_LOGGED_OUT' });
      }
    });

    const getFormattedDate = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${day}/${month}/${year}`;
    };

    const today = new Date();
    const dates = [0, 1, 2, 3].map(offset => {
      const date = new Date();
      date.setDate(today.getDate() + offset);
      return getFormattedDate(date);
    });

    dates.forEach(date => {
      dispatch(FecthEvents(date));
      console.log('Fecha:', date);
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    console.log('Matches:', matches);
  }, [matches]);

  return (
    <div className='home-page'>
      <header className='paul-header'>
        <div className='web-logo'>
          <img src={paul} alt="" className='logo' />
          <h1>Paul's Sports</h1>
        </div>
        <button className='hmenu'><img src={ball} alt="" className='ball' /></button>
      </header>
      <section className='paul-body'>
        <div className='matches-container'>
          <h2 className='matches-tittle'>Next Matches:</h2>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && matches.length > 0 && matches.map((match, index) => (
            <div key={match.id} className='match'>
              <div className='Tournament-logos'>
                {match.tournament?.image && <img src={match.tournament.image} alt={`${match.tournament.name} logo`} className='Tournament-logo-img' />}
              </div>
              <div className='match-data'>
                <div className='title-name'>
                  <p>{match.tournament?.name || 'Unknown'}</p> <p>{match.date}</p>
                </div>
                <div className='teams-data'>
                  <strong className='team-name'>{match.homeTeam?.name}</strong> 
                  {match.homeTeam?.image && <img src={match.homeTeam.image} alt={`${match.homeTeam.name} logo`} className='team-logo' />}
                  <div className='Home-Score'>{match.homeScore?.current ?? 0}</div>
                  -
                  <div className='Home-Score'>{match.awayScore?.current ?? 0}</div>
                  {match.awayTeam?.image && <img src={match.awayTeam.image} alt={`${match.awayTeam.name} logo`} className='team-logo' />}
                  <strong className='team-name'>{match.awayTeam?.name}</strong>
                  <div className='team-logos'>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && !error && matches.length === 0 && <p>No matches found for the given dates</p>}
        </div>
      </section>
    </div>
  );
}

export default MainPage;
