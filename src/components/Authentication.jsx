import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import '../stylesheets/Authentication.css';

const Authentication = ({ onLogin, onLogout }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Crear el usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar el nombre de usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        username: username,
      });

      setSuccessMessage('User registered successfully');
      if (onLogin) onLogin(user); // Manejar el login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let userEmail = email;

      // Si el usuario ingresó un nombre de usuario, buscar su correo en Firestore
      if (!email.includes('@')) {
        const q = query(collection(db, 'users'), where('username', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('Username not found');
        }

        // Obtener el correo electrónico del primer documento encontrado
        const userDoc = querySnapshot.docs[0];
        userEmail = userDoc.data().email;
      }

      // Iniciar sesión con el correo electrónico encontrado o proporcionado
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      if (onLogin) onLogin(user); // Manejar el login
    } catch (err) {
      setError(err.message);
    }
  };

  return  (
    <div>
      <form className="auth-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
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

        <label>Email or Username</label>
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

        <button type="submit">
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
