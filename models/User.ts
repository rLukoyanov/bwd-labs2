import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/db';

// Тип для создания нового пользователя (не включая id)
type UserCreationAttributes = Optional<UserAttributes, 'id'>

// Тип для существующего пользователя (включает id)
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string | null;  // Пароль может быть null
  createdAt: Date;
  updatedAt: Date;
}

// Модель User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Разрешаем NULL на этапе миграции
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: ''
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
