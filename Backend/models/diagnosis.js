import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Diagnosis = sequelize.define(
    "Diagnosis",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      result: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // 👈 Usa el nombre del modelo (como lo definiste en User.js)
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "diagnoses", // 👈 el nombre real de la tabla en la BD
      timestamps: true,
    }
  );

  return Diagnosis;
};
