import { Router, Request, Response } from 'express';
import { User } from '@models/index.js';

// Интерфейс для тела запроса при создании пользователя
interface CreateUserRequestBody {
  name: string;
  email: string;
}

const router = Router();

// Создание пользователя
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/', async (req: Request<"", unknown, CreateUserRequestBody>, res: Response): Promise<any> => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Имя и email обязательны' });
    }

    const user = await User.create({
      name,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: 'Ошибка при создании пользователя',
      error: (error as Error).message,
    });
  }
});

// Получение всех пользователей
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при получении пользователей',
      error: (error as Error).message,
    });
  }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: ID пользователя
 *         name:
 *           type: string
 *           description: Имя пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Создать нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь создан
 */
