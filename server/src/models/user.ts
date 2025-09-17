import {
  Sequelize, DataTypes, Model,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';

export default function createUserModel(sequelize: Sequelize) {
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare username: string;
    declare password_hash: string;   // now matches DB column name
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      username: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, tableName: 'users', modelName: 'User', timestamps: true }
  );

  return User;
}
