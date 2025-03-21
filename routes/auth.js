import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

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

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error in /login:", error);  // Логирование ошибки
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

export default router;
