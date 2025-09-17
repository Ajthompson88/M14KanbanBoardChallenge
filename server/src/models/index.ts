import { Sequelize } from 'sequelize';
import createUserModel from './user.js';
import createTicketModel from './ticket.js';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error('DATABASE_URL missing');

export const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: DB_URL.includes('render.com') ? { ssl: { require: true } } : undefined,
  logging: false,
});

export const User = createUserModel(sequelize);
export const Ticket = createTicketModel(sequelize);

User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

export type { TicketStatus } from './ticket.js';
