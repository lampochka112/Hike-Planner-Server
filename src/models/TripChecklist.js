module.exports = (sequelize, DataTypes) => {
  const TripChecklist = sequelize.define('TripChecklist', {
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    items: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  }, {
    tableName: 'trip_checklists'
  });

  TripChecklist.associate = (models) => {
    TripChecklist.belongsTo(models.Trip, {
      foreignKey: 'trip_id',
      as: 'trip'
    });
  };

  return TripChecklist;
};
