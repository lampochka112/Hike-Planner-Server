module.exports = (sequelize, DataTypes) => {
  const TripLocation = sequelize.define('TripLocation', {
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
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estimated_arrival: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'trip_locations'
  });

  TripLocation.associate = (models) => {
    TripLocation.belongsTo(models.Trip, {
      foreignKey: 'trip_id',
      as: 'trip'
    });
  };

  return TripLocation;
};
