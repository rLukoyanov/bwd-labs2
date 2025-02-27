const Router = require('express');
const router = new Router();
const { Event } = require('../models');
const validateApiKey = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - createdBy
 *       properties:
 *         id:
 *           type: integer
 *           description: ID мероприятия
 *         title:
 *           type: string
 *           description: Название мероприятия
 *         description:
 *           type: string
 *           description: Описание мероприятия
 *         date:
 *           type: string
 *           format: date-time
 *           description: Дата проведения
 *         createdBy:
 *           type: integer
 *           description: ID создателя
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество записей на странице
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *   post:
 *     summary: Создать новое мероприятие
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Мероприятие создано
 */

// Получение списка всех мероприятий с пагинацией
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Если не указана страница, берем первую
        const limit = parseInt(req.query.limit) || 10; // Если не указан лимит, берем 10 записей
        const offset = (page - 1) * limit;

        const { count, rows: events } = await Event.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['date', 'ASC']] // Сортировка по дате
        });

        res.json({
            events,
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении мероприятий", error: error.message });
    }
});

// Получение одного мероприятия по ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Мероприятие не найдено" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении мероприятия", error: error.message });
    }
});

// Создание мероприятия (защищено API-ключом)
router.post('/', validateApiKey, async (req, res) => {
    try {
        const { title, description, date, createdBy } = req.body;
        
        // Проверка обязательных полей
        if (!title || !date || !createdBy) {
            return res.status(400).json({ message: "Не все обязательные поля заполнены" });
        }

        const event = await Event.create({
            title,
            description,
            date,
            createdBy
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: "Ошибка при создании мероприятия", error: error.message });
    }
});

// Обновление мероприятия
router.put('/:id', async (req, res) => {
    try {
        const { title, description, date } = req.body;
        
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Мероприятие не найдено" });
        }

        // Обновляем только переданные поля
        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: "Ошибка при обновлении мероприятия", error: error.message });
    }
});

// Удаление мероприятия (защищено API-ключом)
router.delete('/:id', validateApiKey, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Мероприятие не найдено" });
        }

        await event.destroy();
        res.json({ message: "Мероприятие успешно удалено" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при удалении мероприятия", error: error.message });
    }
});

module.exports = router;