import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Verificar si es el usuario admin
    if (username === 'Cecilia' && password === 'ceci123') {
      const adminUser = {
        username: 'Cecilia',
        role: 'admin',
        isAdmin: true
      };
      onLogin(adminUser, 'dummy-token');
      return;
    }

    // Verificar otros usuarios
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username.toLowerCase()];

    if (user && user.password === password) {
      user.role = 'user';
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user, 'dummy-token');
    } else {
      setError('Usuario o contraseña incorrectos');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    let userFound = null;

    // Buscar usuario por email
    Object.values(users).forEach(user => {
      if (user.email && user.email.toLowerCase() === resetEmail.toLowerCase()) {
        userFound = user;
      }
    });

    if (userFound) {
      // Generar contraseña temporal
      const tempPassword = Math.random().toString(36).slice(-8);
      users[userFound.username.toLowerCase()].password = tempPassword;
      localStorage.setItem('users', JSON.stringify(users));

      setSuccessMessage(`Tu nueva contraseña temporal es: ${tempPassword}`);
      setTimeout(() => {
        setSuccessMessage('');
        setShowResetPassword(false);
      }, 10000);
    } else {
      setError('No se encontró ninguna cuenta con ese email');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (showResetPassword) {
    return (
      <div className="login-container">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleResetPassword} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              placeholder="Ingresa tu email registrado"
            />
          </div>
          <button type="submit" className="button">Restablecer Contraseña</button>
          <button 
            type="button" 
            className="button button-secondary"
            onClick={() => setShowResetPassword(false)}
          >
            Volver al Login
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button type="submit" className="button">Iniciar Sesión</button>
        <button 
          type="button" 
          className="button button-link"
          onClick={() => setShowResetPassword(true)}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
        ¿No tienes una cuenta? <Link to="/register" style={{ color: '#FF4081' }}>Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;