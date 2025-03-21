import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import eventRouter from './routes/eventRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/auth.js';
import customLogger from "./middleware/loggingMiddleware.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';
import passport from "passport";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());
app.use(passport.initialize())

// Добавляем morgan с кастомным форматом
app.use(morgan('[:method] :url - :status - :response-time ms'));

// Добавляем наш кастомный logger
app.use(customLogger);

// Подключаем маршруты
app.use('/auth', authRouter)
app.use('/api/events', eventRouter);
app.use('/api/users', userRouter);

// Add before your routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

start();
