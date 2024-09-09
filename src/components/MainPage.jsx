import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../stylesheets/MainPages.css';
import paul from '../img/paul.png';
import ball from '../img/ball.png';
import userImg from '../img/MarzGallery.png';
import { FecthEvents } from '../redux/Leagues/EventSlice';
import Matches from './Matches';
import Authentication from './Authentication';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function MainPage() {
  const dispatch = useDispatch();
  const { matches, loading, error } = useSelector((state) => state.maches);
  const [showAuth, setShowAuth] = useState(false);  // Mostrar/ocultar el formulario de autenticación
  const [user, setUser] = useState(null);           // Guardar el estado del usuario logueado
  const [username, setUsername] = useState(null);   // Guardar el nombre de usuario

  // Al montar el componente, cargar los eventos y observar el estado de autenticación
  useEffect(() => {
    const today = new Date();
    const dates = [0, 1, 2, 3].map(offset => {
      const date = new Date();
      date.setDate(today.getDate() + offset);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });

    // Despachar la acción para obtener los eventos (partidos)
    dates.forEach(date => {
      dispatch(FecthEvents(date));
    });

    // Observar los cambios de estado de autenticación (si el usuario está logueado o no)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); // Actualizar el usuario logueado
      if (currentUser) {
        // Obtener el nombre de usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username); // Actualizar el nombre de usuario
        }
      } else {
        setUsername(null); // Si no hay usuario logueado, limpiar el nombre de usuario
      }
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [dispatch]);

  // Función para desloguear al usuario
  const handleLogout = () => {
    signOut(auth)  // Firebase signOut
      .then(() => {
        setUser(null);  // Limpiar el estado del usuario
        setUsername(null);  // Limpiar el nombre de usuario
        setShowAuth(false);  // Cerrar el formulario de autenticación
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  // Función para formatear la hora de los eventos
  const formatTime = (timestamp, offset = 0) => {
    const date = new Date(timestamp + offset * 60 * 60 * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className='home-page'>
      {/* Header con logo y opciones */}
      <header className='paul-header'>
        <div className='web-logo'>
          <img src={paul} alt="" className='logo' />
          <h1>Paul's Sports</h1>
        </div>
        <div className='options-containers'>
          <button className='hmenu'><img src={ball} alt="" className='ball' /></button>
          <img src={userImg} alt="user img" className='logo' />

          {/* Botón de login/logout */}
          <button onClick={() => setShowAuth(!showAuth)}>
            {user ? username || user.displayName || user.email : 'Login/Register'} {/* Mostrar nombre de usuario */}
          </button>
        </div>
      </header>

      {/* Cuerpo principal con información de partidos y autenticación */}
      <section className='paul-body'>
        {showAuth && !user && (
          <div className='login-register-cont'>
            {/* Mostrar formulario de autenticación si el usuario no está logueado */}
            <Authentication onLogin={setUser} onLogout={() => setUser(null)} />
          </div>
        )}

        {/* Si el usuario está logueado, mostrar su nombre y botón de logout */}
        {user && (
          <div className='user-info'>
            <button onClick={handleLogout}>Logout</button> {/* Botón de logout */}
          </div>
        )}

        {/* Mostrar los partidos */}
        <Matches matches={matches} loading={loading} error={error} formatTime={formatTime} />
      </section>
    </div>
  );
}

export default MainPage;
