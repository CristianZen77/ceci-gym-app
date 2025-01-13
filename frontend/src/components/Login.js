import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Verificar si es el usuario admin
      if (username === 'Admin' && password === 'admin123') {
        const adminUser = {
          username: 'Admin',
          role: 'admin',
          isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        onLogin(adminUser, 'dummy-token');
        return;
      }

      // Verificar otros usuarios
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const user = users[username.toLowerCase()];

      if (user && user.password === password && !user.isBlocked) {
        user.role = 'user';
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user, 'dummy-token');
      } else {
        setError('Usuario o contraseña incorrectos');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <img src="/logo.png" alt="Fit Woman Logo" className="login-logo" />
          <h2>Fit Woman</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input 
              id="username"
              type="text" 
              placeholder="Ingresa tu usuario" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              placeholder="Ingresa tu contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;