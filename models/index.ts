import sequelize from '@config/db.js';
import User from './User';
import Event from './Event';

// Установка связи один-ко-многим между User и Event
User.hasMany(Event, {
  foreignKey: 'createdBy',
});

Event.belongsTo(User, {
  foreignKey: 'createdBy',
});

export { sequelize, User, Event };
