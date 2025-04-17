import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/db';

interface EventAttributes {
  id: number;
  title: string;
  description?: string;
  date: Date;
  createdBy: number;
}

type EventCreationAttributes = Optional<EventAttributes, 'id'>

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public date!: Date;
  public createdBy!: number;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: true,
  },
);

export default Event;