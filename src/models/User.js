const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    experience_level: {
      type: DataTypes.ENUM('новичок', 'любитель', 'опытный', 'профессионал'),
      defaultValue: 'новичок'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      }
    }
  });

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  };

  User.associate = (models) => {
    User.hasMany(models.Trip, {
      foreignKey: 'organizer_id',
      as: 'organizedTrips'
    });
    User.hasMany(models.TripParticipant, {
      foreignKey: 'user_id',
      as: 'participations'
    });
    User.hasMany(models.UserEquipment, {
      foreignKey: 'user_id',
      as: 'equipment'
    });
    User.hasOne(models.UserMedicalInfo, {
      foreignKey: 'user_id',
      as: 'medicalInfo'
    });
    User.hasMany(models.TripComment, {
      foreignKey: 'user_id',
      as: 'comments'
    });
  };

  return User;
};
