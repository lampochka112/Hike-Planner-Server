const tripService = require('../services/tripService');
const { Trip, TripLocation, TripParticipant, TripEquipment, User } = require('../models');
const { validationResult } = require('express-validator');

class TripController {
  async getTrips(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        difficulty_level: req.query.difficulty,
        start_date: req.query.start_date,
        search: req.query.search
      };

      const trips = await tripService.getTrips(filters);
      res.json({ trips, count: trips.length });
    } catch (error) {
      next(error);
    }
  }

  async getTrip(req, res) {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url', 'experience_level']
        },
        {
          model: TripLocation,
          as: 'locations',
          order: [['order_index', 'ASC']]
        },
        {
          model: TripParticipant,
          as: 'participants',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'avatar_url', 'experience_level']
          }]
        },
        {
          model: TripEquipment,
          as: 'equipment',
          include: [{
            model: User,
            as: 'responsible',
            attributes: ['id', 'first_name', 'last_name']
          }]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ message: 'Поход не найден' });
    }

    res.json({ trip });
  }

  async createTrip(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const trip = await tripService.createTrip(req.body, req.user.id);
      res.status(201).json({ message: 'Поход создан', trip });
    } catch (error) {
      next(error);
    }
  }

  async updateTrip(req, res, next) {
    try {
      if (!req.isOrganizer) {
        return res.status(403).json({ message: 'Только организатор может редактировать поход' });
      }

      const allowedUpdates = ['title', 'description', 'difficulty_level', 'start_date', 'end_date', 'max_participants'];
      const updates = {};

      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      await req.trip.update(updates);
      res.json({ message: 'Поход обновлён', trip: req.trip });
    } catch (error) {
      next(error);
    }
  }

  async cancelTrip(req, res, next) {
    try {
      if (!req.isOrganizer) {
        return res.status(403).json({ message: 'Только организатор может отменить поход' });
      }

      req.trip.status = 'cancelled';
      await req.trip.save();

      res.json({ message: 'Поход отменён', trip: req.trip });
    } catch (error) {
      next(error);
    }
  }

  async applyForTrip(req, res, next) {
    try {
      const participation = await tripService.applyForTrip(req.params.tripId, req.user.id);
      res.status(201).json({ message: 'Заявка подана', participation });
    } catch (error) {
      if (error.message === 'Вы уже подали заявку на этот поход') {
        return res.status(409).json({ message: error.message });
      }
      if (error.message === 'Достигнут лимит участников') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  }

  async manageParticipant(req, res, next) {
    try {
      const { status } = req.body;
      const participation = await tripService.manageParticipant(
        req.params.tripId,
        req.params.userId,
        status,
        req.user.id
      );

      res.json({ message: `Статус участника изменён на ${status}`, participation });
    } catch (error) {
      next(error);
    }
  }

  async addLocation(req, res, next) {
    try {
      if (!req.isOrganizer) {
        return res.status(403).json({ message: 'Только организатор может редактировать маршрут' });
      }

      const location = await TripLocation.create({
        ...req.body,
        trip_id: req.params.tripId
      });

      res.status(201).json({ message: 'Точка маршрута добавлена', location });
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(req, res, next) {
    try {
      if (!req.isOrganizer) {
        return res.status(403).json({ message: 'Только организатор может редактировать маршрут' });
      }

      const location = await TripLocation.findOne({
        where: { id: req.params.locationId, trip_id: req.params.tripId }
      });

      if (!location) {
        return res.status(404).json({ message: 'Точка маршрута не найдена' });
      }

      await location.update(req.body);
      res.json({ message: 'Точка маршрута обновлена', location });
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req, res, next) {
    try {
      if (!req.isOrganizer) {
        return res.status(403).json({ message: 'Только организатор может редактировать маршрут' });
      }

      const location = await TripLocation.findOne({
        where: { id: req.params.locationId, trip_id: req.params.tripId }
      });

      if (!location) {
        return res.status(404).json({ message: 'Точка маршрута не найдена' });
      }

      await location.destroy();
      res.json({ message: 'Точка маршрута удалена' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TripController();
