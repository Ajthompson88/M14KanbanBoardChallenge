import {
  Sequelize, DataTypes, Model,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';

export type TicketStatus = 'todo' | 'in_progress' | 'done';

export default function createTicketModel(sequelize: Sequelize) {
  class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> {
    declare id: CreationOptional<number>;
    declare title: string;                      // matches DB column "title"
    declare description: string | null;
    declare status: TicketStatus;               // varchar in DB is fine
    declare userId: number | null;              // matches DB column "userId"
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }

  Ticket.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'todo' },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, tableName: 'tickets', modelName: 'Ticket', timestamps: true }
  );

  return Ticket;
}
