module.exports = (sequelize, DataTypes) => {
  const TripComment = sequelize.define('TripComment', {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'trip_comments'
  });

  TripComment.associate = (models) => {
    TripComment.belongsTo(models.Trip, {
      foreignKey: 'trip_id',
      as: 'trip'
    });
    TripComment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return TripComment;
};
