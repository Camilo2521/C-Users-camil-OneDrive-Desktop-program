import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Session = sequelize.define(
    "Session",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "sessions",
      timestamps: true,
    }
  );

  return Session;
};
