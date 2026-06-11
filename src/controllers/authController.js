const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, first_name, last_name, experience_level, bio } = req.body;
      const result = await authService.register({
        email,
        password,
        first_name,
        last_name,
        experience_level,
        bio
      });

      res.status(201).json({
        message: 'Регистрация успешна',
        user: result.user,
        tokens: result.tokens
      });
    } catch (error) {
      if (error.message === 'Пользователь с таким email уже существует') {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        message: 'Вход выполнен успешно',
        user: result.user,
        tokens: result.tokens
      });
    } catch (error) {
      if (error.message === 'Неверный email или пароль') {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token не предоставлен' });
      }

      const result = await authService.refreshToken(refreshToken);

      res.json({
        message: 'Токены обновлены',
        user: result.user,
        tokens: result.tokens
      });
    } catch (error) {
      if (error.message === 'Недействительный refresh токен') {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
  }

  async getMe(req, res) {
    res.json({ user: req.user });
  }

  async updateProfile(req, res, next) {
    try {
      const allowedUpdates = ['first_name', 'last_name', 'experience_level', 'bio', 'avatar_url'];
      const updates = {};

      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      await req.user.update(updates);
      res.json({ message: 'Профиль обновлён', user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
