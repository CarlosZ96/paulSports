import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // El usuario ha iniciado sesión
        dispatch({ type: 'USER_LOGGED_IN', payload: user });
      } else {
        // El usuario ha cerrado sesión
        dispatch({ type: 'USER_LOGGED_OUT' });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);


  return (
    <div>
      <header>
        <h1>Paul's Sports</h1>
        <div></div>
      </header>
      <section>

      </section>
    </div>
  );
}

export default MainPage;
