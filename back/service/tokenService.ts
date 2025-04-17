import jwt, { JwtPayload } from 'jsonwebtoken';

// Функция генерации access токена
const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '15m',
  }); // 15 минут для access токена
};

// Функция генерации refresh токена
const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d',
  }); // 7 дней для refresh токена
};

// Функция для верификации refresh токена
const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

// Функция для верификации access токена
const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
};
