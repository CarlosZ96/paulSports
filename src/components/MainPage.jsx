import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import '../stylesheets/MainPages.css';
import paul from '../img/paul.png';
import ball from '../img/ball.png';
import userImg from '../img/MarzGallery.png';
import { FecthEvents } from '../redux/Leagues/EventSlice';
import Matches from './Matches';
import Authentication from './Authentication';

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
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        dispatch({ type: 'USER_LOGGED_IN', payload: user });
      } else {
        setUser(null);
        dispatch({ type: 'USER_LOGGED_OUT' });
      }
    });

    const today = new Date();
    const dates = [0, 1, 2, 3].map(offset => {
      const date = new Date();
      date.setDate(today.getDate() + offset);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });

    dates.forEach(date => {
      dispatch(FecthEvents(date));
      console.log('Fecha:', date);
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setShowAuth(false);
    });
  };

  const formatTime = (timestamp, offset = 0) => {
    const date = new Date(timestamp + offset * 60 * 60 * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className='home-page'>
      <header className='paul-header'>
        <div className='web-logo'>
          <img src={paul} alt="" className='logo' />
          <h1>Paul's Sports</h1>
        </div>
        <div className='options-containers'>
          <button className='hmenu'><img src={ball} alt="" className='ball' /></button>
          <img src={userImg} alt="user img" className='logo' />
          <button onClick={() => setShowAuth(!showAuth)}>
            {user ? user.displayName || user.email : 'Login/Register'}
          </button>
          {user && (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </header>
      
      <section className='paul-body'>
        {showAuth && !user && (
          <div className='login-register-cont'>
            <Authentication onLogin={(user) => {
              setUser(user);
              setShowAuth(false);
            }} 
            onLogout={handleLogout} />
          </div>
        )}
        
        <Matches matches={matches} loading={loading} error={error} formatTime={formatTime} />
      </section>
    </div>
  );
}

export default MainPage;
