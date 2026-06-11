const { Trip, TripParticipant, TripLocation, TripEquipment, User } = require('../models');
const { Op } = require('sequelize');

class TripService {
  async getTrips(filters = {}) {
    const where = {};

    if (filters.status) where.status = filters.status;
    if (filters.difficulty_level) where.difficulty_level = filters.difficulty_level;
    if (filters.start_date) where.start_date = { [Op.gte]: filters.start_date };
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const trips = await Trip.findAll({
      where,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'first_name', 'last_name', 'avatar_url', 'experience_level']
        },
        {
          model: TripParticipant,
          as: 'participants',
          where: { status: 'approved' },
          required: false
        }
      ],
      order: [['start_date', 'ASC']]
    });

    return trips;
  }

  async createTrip(tripData, organizerId) {
    const trip = await Trip.create({
      ...tripData,
      organizer_id: organizerId,
      status: 'planning'
    });

    
    await TripParticipant.create({
      trip_id: trip.id,
      user_id: organizerId,
      status: 'approved',
      role_in_trip: 'organizer'
    });

    return trip;
  }

  async applyForTrip(tripId, userId) {
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      throw new Error('Поход не найден');
    }

    if (trip.status === 'cancelled' || trip.status === 'completed') {
      throw new Error('Нельзя подать заявку на этот поход');
    }

    
    if (trip.max_participants) {
      const approvedCount = await TripParticipant.count({
        where: { trip_id: tripId, status: 'approved' }
      });

      if (approvedCount >= trip.max_participants) {
        throw new Error('Достигнут лимит участников');
      }
    }

    const existingApplication = await TripParticipant.findOne({
      where: { trip_id: tripId, user_id: userId }
    });

    if (existingApplication) {
      throw new Error('Вы уже подали заявку на этот поход');
    }

    const participation = await TripParticipant.create({
      trip_id: tripId,
      user_id: userId,
      status: 'pending',
      role_in_trip: 'participant'
    });

    return participation;
  }

  async manageParticipant(tripId, userId, action, organizerId) {
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      throw new Error('Поход не найден');
    }

    if (trip.organizer_id !== organizerId) {
      throw new Error('Только организатор может управлять участниками');
    }

    const participation = await TripParticipant.findOne({
      where: { trip_id: tripId, user_id: userId }
    });

    if (!participation) {
      throw new Error('Заявка не найдена');
    }

    if (participation.role_in_trip === 'organizer') {
      throw new Error('Нельзя изменить статус организатора');
    }

    const validActions = ['approved', 'rejected', 'cancelled'];
    if (!validActions.includes(action)) {
      throw new Error('Недопустимое действие');
    }

    participation.status = action;
    await participation.save();

    // Проверяем и обновляем статус похода
    await this.updateTripStatus(tripId);

    return participation;
  }

  async updateTripStatus(tripId) {
    const trip = await Trip.findByPk(tripId);
    
    if (!trip || trip.status === 'cancelled' || trip.status === 'completed') {
      return;
    }

    const approvedCount = await TripParticipant.count({
      where: { trip_id: tripId, status: 'approved' }
    });

    if (trip.max_participants && approvedCount >= trip.max_participants) {
      trip.status = 'full';
    } else if (trip.status === 'full' && approvedCount < trip.max_participants) {
      trip.status = 'recruiting';
    } else if (trip.status === 'planning' && approvedCount > 1) {
      trip.status = 'recruiting';
    }

    await trip.save();
    return trip;
  }
}

module.exports = new TripService();
