module.exports = (sequelize, DataTypes) => {
  const TripEquipment = sequelize.define('TripEquipment', {
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
    category: {
      type: DataTypes.ENUM('одежда', 'обувь', 'рюкзак', 'палатка', 'кухня', 'аптечка', 'навигация', 'другое'),
      allowNull: false
    },
    weight_grams: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity_needed: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    responsible_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'trip_equipment'
  });

  TripEquipment.associate = (models) => {
    TripEquipment.belongsTo(models.Trip, {
      foreignKey: 'trip_id',
      as: 'trip'
    });
    TripEquipment.belongsTo(models.User, {
      foreignKey: 'responsible_user_id',
      as: 'responsible'
    });
  };

  return TripEquipment;
};
