const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Obtener todos los usuarios
router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Bloquear/Desbloquear usuario
router.put('/users/:id/toggle-block', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    user.isBlocked = !user.isBlocked;
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Editar usuario
router.put('/users/:id', [auth, isAdmin], async (req, res) => {
  const { plan, classesRemaining } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    if (plan) user.plan = plan;
    if (classesRemaining) user.classesRemaining = classesRemaining;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Eliminar usuario
router.delete('/users/:id', [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Eliminar todas las reservas del usuario
    await Booking.deleteMany({ user: req.params.id });
    
    // Eliminar usuario
    await user.remove();
    
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Obtener todas las reservas
router.get('/bookings', [auth, isAdmin], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', ['username', 'plan'])
      .sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;