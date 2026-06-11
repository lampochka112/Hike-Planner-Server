const { body } = require('express-validator');

const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов'),
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('Имя обязательно')
    .isLength({ max: 100 })
    .withMessage('Имя не должно превышать 100 символов'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Фамилия обязательна')
    .isLength({ max: 100 })
    .withMessage('Фамилия не должна превышать 100 символов'),
  body('experience_level')
    .optional()
    .isIn(['новичок', 'любитель', 'опытный', 'профессионал'])
    .withMessage('Недопустимый уровень опыта'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Описание не должно превышать 1000 символов')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен')
];

module.exports = { registerValidator, loginValidator };
