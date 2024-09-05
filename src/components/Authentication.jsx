import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import '../stylesheets/Authentication.css';

const Authentication = ({ onLogin, onLogout }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const auth = getAuth();
  const db = getFirestore(); // Firestore instance

  const handleLogin = async (e) => {
    e.preventDefault();

    let loginEmail = email; // Por defecto intentamos con el correo

    // Si el usuario introduce un nombre de usuario en vez de un correo
    if (!email.includes('@')) {
      try {
        // Buscamos el correo correspondiente al nombre de usuario en Firestore
        const userDoc = await getDoc(doc(db, 'usernames', email));
        if (userDoc.exists()) {
          loginEmail = userDoc.data().email; // Obtenemos el correo del nombre de usuario
        } else {
          setError('No user found with that username');
          return;
        }
      } catch (err) {
        setError('Error checking username: ' + err.message);
        return;
      }
    }

    signInWithEmailAndPassword(auth, loginEmail, password)
      .then((userCredential) => {
        console.log('Logged in:', userCredential.user);
        setError(null);
        setSuccessMessage('Logged in successfully!');
        onLogin(userCredential.user);  // Notificamos que el usuario ha iniciado sesión
        setTimeout(() => setSuccessMessage(null), 3000);
      })
      .catch((error) => {
        setError('Login failed: ' + error.message);
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Username is required');
      return;
    }

    try {
      // Verificamos si el nombre de usuario ya existe
      const userDoc = await getDoc(doc(db, 'usernames', username));
      if (userDoc.exists()) {
        setError('Username already taken');
        return;
      }

      // Si el nombre de usuario está disponible, registramos el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardamos el nombre de usuario en Firestore
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid,
        email: email,
      });

      console.log('Registered:', user);
      setError(null);
      setSuccessMessage('User created successfully! Please log in.');
      setUsername(''); // Limpiamos los campos
      setEmail('');
      setPassword('');
      setIsRegistering(false); // Volvemos al estado de inicio de sesión
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Registration failed: ' + error.message);
    }
  };

  return (
    <div>
      <form className="auth-form">
        {isRegistering && (
          <>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </>
        )}

        <label>Email or Username:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isRegistering ? "Enter email" : "Enter email or username"}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button onClick={isRegistering ? handleRegister : handleLogin}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        className="toggle-auth-mode"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Register"}
      </button>

      <button onClick={() => signOut(auth).then(onLogout)} hidden={!auth.currentUser}>
        Logout
      </button>
    </div>
  );
};

export default Authentication;
