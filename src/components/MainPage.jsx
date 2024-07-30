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
  const matches = useSelector((state) => state.maches.matches);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'USER_LOGGED_IN', payload: user });
      } else {
        dispatch({ type: 'USER_LOGGED_OUT' });
      }
    });

    const getFormattedDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };


    const today = new Date();
    const dates = [0, 1, 2, 3].map(offset => {
      const date = new Date();
      date.setDate(today.getDate() + offset);
      return getFormattedDate(date);
    });

    // Despachar la acción para cada fecha
    dates.forEach(date => {
      dispatch(FecthEvents(date));
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
        </div>
      </section>
    </div>
  );
}

export default MainPage;