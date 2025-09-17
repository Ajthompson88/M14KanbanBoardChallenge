import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export type TicketStatus = 'todo' | 'in_progress' | 'done';

export default function createTicketModel(sequelize: Sequelize) {
  class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: CreationOptional<string | null>;
    declare status: CreationOptional<TicketStatus>;
    declare userId: CreationOptional<number | null>;
  }

  Ticket.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'done'),
        allowNull: false,
        defaultValue: 'todo',
      },
      userId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { sequelize, modelName: 'Ticket', tableName: 'tickets', timestamps: true }
  );

  return Ticket;
}
