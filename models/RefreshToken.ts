import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/db';
import User from './User';

// Тип для создания нового токена (не включая id)
type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, 'id'>

// Тип для существующего токена (включает id)
interface RefreshTokenAttributes {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
}

// Модель RefreshToken
class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  public id!: number;
  public token!: string;
  public userId!: number;
  public expiresAt!: Date;

  // Время создания и обновления (генерируется автоматически)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
  }
);

// Устанавливаем связи
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default RefreshToken;
