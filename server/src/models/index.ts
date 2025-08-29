// models/index.ts
import { sequelize } from '../config/connection.js';
import { User as UserClass, UserFactory } from './user.js';
import { Ticket as TicketClass, TicketFactory } from './ticket.js';
import dotenv from 'dotenv';

dotenv.config();

UserFactory(sequelize);

// Initialize models
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

// Associations
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
User.hasMany(Ticket, { foreignKey: 'assignedUserId', as: 'tickets' });

export { sequelize, User, Ticket };
export default sequelize;
