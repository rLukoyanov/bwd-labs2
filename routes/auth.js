import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../service/tokenService.js';

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email уже используется" });
        }

        const hashedPassword = await bcrypt.hash(password, 10) || "123";
        const user = await User.create({ email, name, password: hashedPassword });

        res.status(201).json({ message: "Регистрация успешна" });
    } catch (error) {
        console.error("Error in /register:", error);  // Логирование ошибки
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
  
      // Сохраняем refresh токен в базе данных
      const refreshTokenRecord = await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      });
  
      res.json({
        accessToken,
        refreshToken: refreshTokenRecord.token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Обновление refresh токена
  router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
  
    const decoded = verifyRefreshToken(refreshToken);
  
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  
    try {
      const existingRefreshToken = await refreshToken.findOne({ where: { token: refreshToken } });
  
      if (!existingRefreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
      const user = await User.findByPk(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const accessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);
  
      // Обновляем или создаём новый refresh токен
      await existingRefreshToken.update({
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      });
  
      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

export default router;
