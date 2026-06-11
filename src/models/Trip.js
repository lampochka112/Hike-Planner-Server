module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organizer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    difficulty_level: {
      type: DataTypes.ENUM('лёгкий', 'средний', 'сложный', 'экстремальный'),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('planning', 'recruiting', 'full', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'planning'
    }
  }, {
    tableName: 'trips',
    validate: {
      endDateAfterStartDate() {
        if (this.end_date <= this.start_date) {
          throw new Error('Дата окончания должна быть позже даты начала');
        }
      }
    }
  });

  Trip.associate = (models) => {
    Trip.belongsTo(models.User, {
      foreignKey: 'organizer_id',
      as: 'organizer'
    });
    Trip.hasMany(models.TripLocation, {
      foreignKey: 'trip_id',
      as: 'locations'
    });
    Trip.hasMany(models.TripParticipant, {
      foreignKey: 'trip_id',
      as: 'participants'
    });
    Trip.hasMany(models.TripEquipment, {
      foreignKey: 'trip_id',
      as: 'equipment'
    });
    Trip.hasMany(models.TripChecklist, {
      foreignKey: 'trip_id',
      as: 'checklists'
    });
    Trip.hasMany(models.TripComment, {
      foreignKey: 'trip_id',
      as: 'comments'
    });
  };

  return Trip;
};
