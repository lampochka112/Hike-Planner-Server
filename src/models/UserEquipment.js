module.exports = (sequelize, DataTypes) => {
  const UserEquipment = sequelize.define('UserEquipment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
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
    condition: {
      type: DataTypes.ENUM('новое', 'хорошее', 'требует ремонта'),
      defaultValue: 'хорошее'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'user_equipment'
  });

  UserEquipment.associate = (models) => {
    UserEquipment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserEquipment;
};
