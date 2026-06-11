const { Trip, TripParticipant } = require('../models');

const tripAccess = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Поход не найден' });
    }

    const participation = await TripParticipant.findOne({
      where: {
        trip_id: tripId,
        user_id: req.user.id,
        status: 'approved'
      }
    });

    req.trip = trip;
    req.isOrganizer = trip.organizer_id === req.user.id;
    req.isParticipant = !!participation;
    req.participation = participation;

    next();
  } catch (error) {
    next(error);
  }
};

const roleGuard = (roles) => {
  return (req, res, next) => {
    if (!roles.includes('organizer') || req.isOrganizer) {
      return next();
    }
    if (roles.includes('participant') && req.isParticipant) {
      return next();
    }
    return res.status(403).json({ message: 'Недостаточно прав' });
  };
};

module.exports = { tripAccess, roleGuard };
