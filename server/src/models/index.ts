// server/src/models/index.ts
import { Sequelize } from 'sequelize';
import createUserModel from './user.js';
import createTicketModel from './ticket.js';

const rawUrl = process.env.DATABASE_URL || process.env.DB_URL;
if (!rawUrl) throw new Error('DATABASE_URL missing');

const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const shouldUseSSL = isProd || String(process.env.DB_SSL || '').toLowerCase() === 'true';

let DB_URL = rawUrl;
// Append sslmode=require if we want SSL and it's not already specified
if (shouldUseSSL && !/sslmode=(require|disable)/i.test(DB_URL)) {
  DB_URL += (DB_URL.includes('?') ? '&' : '?') + 'sslmode=require';
}

export const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: shouldUseSSL ? { ssl: { require: true, rejectUnauthorized: false } } : undefined,
});

export const User = createUserModel(sequelize);
export const Ticket = createTicketModel(sequelize);

User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

export type { TicketStatus } from './ticket.js';
