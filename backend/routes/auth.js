const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Ruta POST api/auth/register
router.post('/register', [
  check('username', 'El nombre de usuario es requerido').not().isEmpty(),
  check('password', 'La contraseña debe tener entre 1 y 8 caracteres').isLength({ min: 1, max: 8 }),
  check('plan', 'El plan es requerido').isIn(['Full', 'Medio', 'Base'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, plan } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Establecer número de clases según el plan
    let classesRemaining;
    switch (plan) {
      case 'Full': classesRemaining = 16; break;
      case 'Medio': classesRemaining = 12; break;
      case 'Base': classesRemaining = 8; break;
    }

    user = new User({
      username,
      password,
      plan,
      classesRemaining
    });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Crear y retornar JWT
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta POST api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar credenciales de admin
    if (username === 'Admin' && password === 'admin123') {
      const token = jwt.sign(
        { username: 'Admin', isAdmin: true },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          username: 'Admin',
          isAdmin: true,
          role: 'admin'
        }
      });
    }

    // Si no es admin, verificar otros usuarios
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username.toLowerCase()];

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Usuario bloqueado'
      });
    }

    const token = jwt.sign(
      { username: user.username, isAdmin: false },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        ...user,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

// Ruta GET api/auth/user
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;