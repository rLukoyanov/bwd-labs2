/* eslint-disable @typescript-eslint/no-explicit-any */
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events API',
      version: '1.0.0',
      description: 'API для управления мероприятиями и пользователями',
    },
    servers: [
      {
        url: 'http://localhost:5005',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.ts'], // путь к файлам с маршрутами
};

const specs = swaggerJsdoc(options as any);
export default specs;
