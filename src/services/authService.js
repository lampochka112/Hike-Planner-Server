const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    return { accessToken, refreshToken };
  }

  async register(userData) {
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const user = await User.create({
      email: userData.email,
      password_hash: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      experience_level: userData.experience_level || 'новичок',
      bio: userData.bio
    });

    const tokens = this.generateTokens(user.id);
    return { user, tokens };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error('Неверный email или пароль');
    }

    const tokens = this.generateTokens(user.id);
    return { user, tokens };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const tokens = this.generateTokens(user.id);
      return { user, tokens };
    } catch (error) {
      throw new Error('Недействительный refresh токен');
    }
  }
}

module.exports = new AuthService();
