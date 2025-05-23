/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { Event } from '@models/index';
import validateApiKey from '@middleware/authMiddleware';

const router = Router();

// Типизация для тела запроса на создание события
interface EventRequestBody {
  title: string;
  description?: string;
  date: string; // Можно использовать Date, если будет работать с датой
  createdBy: number;
}

// Типизация для параметра id в URL
interface EventRequestParams {
  id: string;
}

// Получение всех мероприятий
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Если не указана страница, берем первую
    const limit = parseInt(req.query.limit as string) || 10; // Если не указан лимит, берем 10 записей
    const offset = (page - 1) * limit;

    const { count, rows: events } = await Event.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['date', 'ASC']], // Сортировка по дате
    });

    res.json({
      events,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Ошибка при получении мероприятий',
      error: error.message,
    });
  }
});

// Получение одного мероприятия по ID
router.get('/:id', async (req: Request<EventRequestParams, "", "">, res: Response): Promise<any> => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    res.json(event);
  } catch (error: any) {
    res.status(500).json({
      message: 'Ошибка при получении мероприятия',
      error: error.message,
    });
  }
});

// Создание нового мероприятия
router.post('/', validateApiKey, async (req: Request<any, "", EventRequestBody>, res: Response): Promise<any> => {
  try {
    const { title, description, date, createdBy } = req.body;

    if (!title || !date || !createdBy) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
    }

    const event = await Event.create({
      title,
      description,
      date: date as unknown as Date,
      createdBy,
    });

    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({
      message: 'Ошибка при создании мероприятия',
      error: error.message,
    });
  }
});

// Обновление мероприятия
router.put('/:id', async (req: Request<EventRequestParams, "", EventRequestBody>, res: Response): Promise<any> => {
  try {
    const { title, description, date } = req.body;

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date as unknown as Date;

    await event.save();
    res.json(event);
  } catch (error: any) {
    res.status(400).json({
      message: 'Ошибка при обновлении мероприятия',
      error: error.message,
    });
  }
});

// Удаление мероприятия
router.delete('/:id', validateApiKey, async (req: Request<any, "", "">, res: Response): Promise<any> => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    await event.destroy();
    res.json({ message: 'Мероприятие успешно удалено' });
  } catch (error: any) {
    res.status(500).json({
      message: 'Ошибка при удалении мероприятия',
      error: error.message,
    });
  }
});

export default router;



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
 *       400:
 *         description: Ошибка при создании мероприятия
 *   put:
 *     summary: Обновить мероприятие
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при обновлении мероприятия
 *   delete:
 *     summary: Удалить мероприятие
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка при удалении мероприятия
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Получить одно мероприятие по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие найдено
 *       404:
 *         description: Мероприятие не найдено
 */
