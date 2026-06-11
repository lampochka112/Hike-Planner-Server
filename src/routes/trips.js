const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const { tripAccess, roleGuard } = require('../middleware/tripAccess');
const { createTripValidator } = require('../validators/tripValidators');

// Публичные маршруты
router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTrip);

// Защищённые маршруты
router.post('/', auth, createTripValidator, tripController.createTrip);

// Маршруты для конкретного похода
router.put('/:id', auth, tripAccess, roleGuard(['organizer']), tripController.updateTrip);
router.delete('/:id', auth, tripAccess, roleGuard(['organizer']), tripController.cancelTrip);

// Участники
router.post('/:tripId/apply', auth, tripController.applyForTrip);
router.put('/:tripId/participants/:userId', auth, tripAccess, roleGuard(['organizer']), tripController.manageParticipant);

// Маршрут
router.post('/:tripId/locations', auth, tripAccess, roleGuard(['organizer']), tripController.addLocation);
router.put('/:tripId/locations/:locationId', auth, tripAccess, roleGuard(['organizer']), tripController.updateLocation);
router.delete('/:tripId/locations/:locationId', auth, tripAccess, roleGuard(['organizer']), tripController.deleteLocation);

module.exports = router;
