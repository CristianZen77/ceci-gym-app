const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Crear una reserva
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isBlocked) {
      return res.status(403).json({ msg: 'Usuario bloqueado' });
    }

    if (user.classesRemaining <= 0) {
      return res.status(400).json({ msg: 'No tienes clases disponibles' });
    }

    const { className, date } = req.body;
    const bookingDate = new Date(date);
    const now = new Date();

    // Verificar que la reserva sea al menos 30 minutos antes
    if (bookingDate.getTime() - now.getTime() < 30 * 60 * 1000) {
      return res.status(400).json({ msg: 'Las reservas deben hacerse con al menos 30 minutos de anticipación' });
    }

    // Verificar el día y la clase
    const dayOfWeek = bookingDate.getDay();
    if (className === 'Full Body' && ![1, 3, 5].includes(dayOfWeek)) {
      return res.status(400).json({ msg: 'Full Body solo disponible Lunes, Miércoles y Viernes' });
    }
    if (className === 'Funcional' && ![2, 4].includes(dayOfWeek)) {
      return res.status(400).json({ msg: 'Funcional solo disponible Martes y Jueves' });
    }

    const booking = new Booking({
      user: req.user.id,
      className,
      date: bookingDate
    });

    await booking.save();

    // Decrementar clases disponibles
    user.classesRemaining--;
    await user.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Obtener reservas del usuario
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      user: req.user.id,
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Cancelar reserva
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenezca al usuario
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    const now = new Date();
    const bookingDate = new Date(booking.date);

    // Verificar que la cancelación sea al menos 30 minutos antes
    if (bookingDate.getTime() - now.getTime() < 30 * 60 * 1000) {
      return res.status(400).json({ msg: 'Las cancelaciones deben hacerse con al menos 30 minutos de anticipación' });
    }

    booking.status = 'cancelada';
    await booking.save();

    // Incrementar clases disponibles
    const user = await User.findById(req.user.id);
    user.classesRemaining++;
    await user.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;