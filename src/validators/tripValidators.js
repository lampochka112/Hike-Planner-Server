const { body } = require('express-validator');

const createTripValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Название похода обязательно')
    .isLength({ max: 200 })
    .withMessage('Название не должно превышать 200 символов'),
  body('description')
    .optional()
    .trim(),
  body('difficulty_level')
    .isIn(['лёгкий', 'средний', 'сложный', 'экстремальный'])
    .withMessage('Недопустимый уровень сложности'),
  body('start_date')
    .isISO8601()
    .withMessage('Некорректная дата начала'),
  body('end_date')
    .isISO8601()
    .withMessage('Некорректная дата окончания')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.start_date)) {
        throw new Error('Дата окончания должна быть позже даты начала');
      }
      return true;
    }),
  body('max_participants')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Минимальное количество участников: 2')
];

module.exports = { createTripValidator };
