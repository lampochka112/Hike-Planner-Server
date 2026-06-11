module.exports = (sequelize, DataTypes) => {
  const UserMedicalInfo = sequelize.define('UserMedicalInfo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    blood_type: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chronic_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_contact: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    emergency_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'user_medical_info'
  });

  UserMedicalInfo.associate = (models) => {
    UserMedicalInfo.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserMedicalInfo;
};
