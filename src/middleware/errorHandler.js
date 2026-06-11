const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Ошибка валидации',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Конфликт данных',
      errors: err.errors.map(e => ({
        field: e.path,
        message: 'Значение уже существует'
      }))
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Внутренняя ошибка сервера'
  });
};

module.exports = errorHandler;
