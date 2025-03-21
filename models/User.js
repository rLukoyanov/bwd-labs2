import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {  // Добавлено поле пароля с разрешением NULL
    type: DataTypes.STRING,
    allowNull: true,  // Разрешаем NULL на этапе миграции
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true
});

export default UserModel;
