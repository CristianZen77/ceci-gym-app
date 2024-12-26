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
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;