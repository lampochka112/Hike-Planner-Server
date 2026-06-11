require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Слишком много запросов, попробуйте позже'
});
app.use('/api/', limiter);

app.use('/api', routes);

app.use(errorHandler);

const start = async () => {
  try {
    const { sequelize } = require('./models');
    await sequelize.authenticate();
    console.log('Подключение к базе данных установлено успешно.');
    
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
    process.exit(1);
  }
};

start();

module.exports = app;
