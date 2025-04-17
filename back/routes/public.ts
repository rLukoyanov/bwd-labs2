import { Router, Request, Response } from 'express';
import Event from '@models/Event';

// Интерфейс для параметров запроса
interface EventQueryParams {
  page?: string; // Страница
  limit?: string; // Лимит записей на странице
}

const router = Router();

router.get('/', async (req: Request<"", "", "", EventQueryParams>, res: Response) => {
  try {
    // Извлечение значений page и limit из query параметров
    const page = parseInt(req.query.page ?? '1'); // Если не указана страница, берем первую
    const limit = parseInt(req.query.limit ?? '10'); // Если не указан лимит, берем 10 записей
    const offset = (page - 1) * limit;

    // Получение списка мероприятий с пагинацией
    const { count, rows: events } = await Event.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['date', 'ASC']], // Сортировка по дате
    });

    // Возврат ответа с мероприятиями и информацией о пагинации
    res.json({
      events,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    // Обработка ошибок
    res.status(500).json({
      message: 'Ошибка при получении мероприятий',
      error: (error as Error).message, // Убедитесь, что error является экземпляром класса Error
    });
  }
});

export default router;

