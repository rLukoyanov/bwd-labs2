import express from 'express';
import cors from 'cors';
import sequelize from './config/db';
import Event from './models/Event';
import User from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const ITEMS_PER_PAGE = 6;
const JWT_SECRET = 'your-secret-key'; // В продакшене используйте переменную окружения

// Middleware
app.use(cors());
app.use(express.json());

// Middleware для проверки JWT токена
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Вход пользователя
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Получение событий с пагинацией
app.get('/api/events', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const { count, rows: events } = await Event.findAndCountAll({
      limit: ITEMS_PER_PAGE,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      events,
      total: count,
      totalPages: Math.ceil(count / ITEMS_PER_PAGE),
      currentPage: page,
      itemsPerPage: ITEMS_PER_PAGE,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Получение деталей события
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// Создание события (требует авторизации)
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Синхронизация базы данных и запуск сервера
sequelize.sync({ force: true }).then(async () => {
  // Создание тестовых событий
  await Event.bulkCreate([
    {
      title: "Концерт группы 'Время и Стекло'",
      description: "Грандиозный концерт популярной группы с новым альбомом",
      date: new Date('2024-05-15T19:00:00'),
      location: "Дворец спорта, Киев",
      imageUrl: "https://example.com/concert1.jpg"
    },
    {
      title: "Выставка современного искусства",
      description: "Экспозиция работ современных украинских художников",
      date: new Date('2024-06-01T10:00:00'),
      location: "Национальный художественный музей, Киев",
      imageUrl: "https://example.com/art1.jpg"
    },
    {
      title: "Фестиваль еды 'Вкус Украины'",
      description: "Фестиваль традиционной украинской кухни с мастер-классами",
      date: new Date('2024-05-20T12:00:00'),
      location: "Певческое поле, Киев",
      imageUrl: "https://example.com/food1.jpg"
    }
  ]);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
