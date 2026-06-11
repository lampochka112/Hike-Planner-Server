'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash('password123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        email: 'ivan@example.com',
        password_hash: passwordHash,
        first_name: 'Иван',
        last_name: 'Петров',
        experience_level: 'опытный',
        bio: 'Опытный турист, организатор походов',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'maria@example.com',
        password_hash: passwordHash,
        first_name: 'Мария',
        last_name: 'Иванова',
        experience_level: 'любитель',
        bio: 'Люблю природу и активный отдых',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        email: 'alex@example.com',
        password_hash: passwordHash,
        first_name: 'Алексей',
        last_name: 'Сидоров',
        experience_level: 'новичок',
        bio: 'Только начинаю ходить в походы',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
