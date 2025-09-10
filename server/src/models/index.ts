// models/index.ts
import { sequelize } from '../config/connection.js';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize models - remove the duplicate UserFactory call
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

// Associations
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
User.hasMany(Ticket, { foreignKey: 'assignedUserId', as: 'tickets' });

export { sequelize, User, Ticket };
export default sequelize;