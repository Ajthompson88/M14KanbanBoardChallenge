// server/src/models/index.ts
import {
  Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes,
  CreationOptional, NonAttribute, ForeignKey
} from "sequelize";

export class User extends Model<
  InferAttributes<User, { omit: "assignedTickets" }>,
  InferCreationAttributes<User, { omit: "assignedTickets" }>
> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare assignedTickets?: NonAttribute<Ticket[]>;
}

export class Ticket extends Model<
  InferAttributes<Ticket, { omit: "assignedUser" }>,
  InferCreationAttributes<Ticket, { omit: "assignedUser" }>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: CreationOptional<string>;
  declare status: "Todo" | "In Progress" | "Done";
  declare assignedUserId: ForeignKey<User["id"]> | null;
  declare assignedUser?: NonAttribute<User | null>;
}

export function initModels(sequelize: Sequelize) {
  User.init(
    { id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false } },
    { sequelize, tableName: "users", timestamps: true }
  );

  Ticket.init(
    { id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      status: { type: DataTypes.ENUM("Todo", "In Progress", "Done"), allowNull: false, defaultValue: "Todo" },
      assignedUserId: { type: DataTypes.INTEGER, allowNull: true } },
    { sequelize, tableName: "tickets", timestamps: true }
  );

  Ticket.belongsTo(User, { as: "assignedUser", foreignKey: "assignedUserId" });
  User.hasMany(Ticket,   { as: "assignedTickets", foreignKey: "assignedUserId" });

  return { User, Ticket };
}
