import Router from 'express';
import { Event } from '../models';

const router = new Router();

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

export default router;
