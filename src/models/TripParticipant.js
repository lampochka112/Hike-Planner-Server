module.exports = (sequelize, DataTypes) => {
  const TripParticipant = sequelize.define('TripParticipant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    trip_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      defaultValue: 'pending'
    },
    role_in_trip: {
      type: DataTypes.ENUM('organizer', 'co_organizer', 'participant'),
      defaultValue: 'participant'
    }
  }, {
    tableName: 'trip_participants',
    indexes: [
      {
        unique: true,
        fields: ['trip_id', 'user_id']
      }
    ]
  });

  TripParticipant.associate = (models) => {
    TripParticipant.belongsTo(models.Trip, {
      foreignKey: 'trip_id',
      as: 'trip'
    });
    TripParticipant.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return TripParticipant;
};
