// server/src/models/user.ts
import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export default function createUserModel(sequelize: Sequelize) {
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare username: string;
    declare password_hash: string; // JS name
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      // 👇 map to existing DB column name
      password_hash: { type: DataTypes.STRING, allowNull: false, field: 'password' },
    },
    { sequelize, modelName: 'User', tableName: 'users', timestamps: true }
  );

  return User;
}
